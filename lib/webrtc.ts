import { SocketManager } from "./socket"

export class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
  private socketManager: SocketManager
  private partnerId: string
  private onRemoteStreamCallback?: (stream: MediaStream) => void
  private onConnectionStateCallback?: (state: string) => void

  private pendingIceCandidates: RTCIceCandidateInit[] = []
  private isRemoteDescriptionSet: boolean = false

  constructor(socketManager: SocketManager, partnerId: string) {
    this.socketManager = socketManager
    this.partnerId = partnerId
    this.initializePeerConnection()
  }

  private initializePeerConnection() {
    const config: RTCConfiguration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    }

    this.peerConnection = new RTCPeerConnection(config)

    this.peerConnection.ontrack = (event) => {
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream()
      }
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream!.addTrack(track)
      })
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(this.remoteStream)
      }
    }

    this.peerConnection.onconnectionstatechange = () => {
      if (this.onConnectionStateCallback && this.peerConnection) {
        this.onConnectionStateCallback(this.peerConnection.connectionState)
      }
    }

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketManager.sendIceCandidate(event.candidate, this.partnerId)
      }
    }
  }

  async getUserMedia(constraints: MediaStreamConstraints = { video: true, audio: true }) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream!)
      })
      return this.localStream
    } catch (error) {
      console.error("❌ Error accessing media devices:", error)
      throw error
    }
  }

  async createOffer() {
    if (!this.peerConnection) return null

    try {
      const offer = await this.peerConnection.createOffer()
      await this.peerConnection.setLocalDescription(offer)
      this.socketManager.sendOffer(offer, this.partnerId)
      return offer
    } catch (error) {
      console.error("❌ Error creating offer:", error)
      return null
    }
  }

  async createAnswer(offer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return null

    try {
      await this.peerConnection.setRemoteDescription(offer)
      this.isRemoteDescriptionSet = true
      const answer = await this.peerConnection.createAnswer()
      await this.peerConnection.setLocalDescription(answer)
      this.socketManager.sendAnswer(answer, this.partnerId)

      // 🧊 Process any ICE candidates that came before remote description was set
      await this.flushPendingIceCandidates()

      return answer
    } catch (error) {
      console.error("❌ Error creating answer:", error)
      return null
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return

    try {
      await this.peerConnection.setRemoteDescription(answer)
      this.isRemoteDescriptionSet = true
      await this.flushPendingIceCandidates()
    } catch (error) {
      console.error("❌ Error handling answer:", error)
    }
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) return

    if (!this.isRemoteDescriptionSet) {
      this.pendingIceCandidates.push(candidate)
      return
    }

    try {
      await this.peerConnection.addIceCandidate(candidate)
    } catch (error) {
      console.error("❌ Error handling ICE candidate:", error)
    }
  }

  private async flushPendingIceCandidates() {
    for (const candidate of this.pendingIceCandidates) {
      try {
        await this.peerConnection?.addIceCandidate(candidate)
      } catch (err) {
        console.error("❌ Failed to flush ICE candidate:", err)
      }
    }
    this.pendingIceCandidates = []
  }

  onRemoteStream(callback: (stream: MediaStream) => void) {
    this.onRemoteStreamCallback = callback
  }

  onConnectionStateChange(callback: (state: string) => void) {
    this.onConnectionStateCallback = callback
  }

  disconnect() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
    }

    if (this.peerConnection) {
      this.peerConnection.close()
    }

    this.localStream = null
    this.remoteStream = null
    this.peerConnection = null
    this.pendingIceCandidates = []
    this.isRemoteDescriptionSet = false
  }

  getLocalStream() {
    return this.localStream
  }

  getRemoteStream() {
    return this.remoteStream
  }
}
