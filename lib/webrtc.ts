import { SocketManager } from "./socket"

export class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
  private socketManager: SocketManager
  private partnerId: string
  private onRemoteStreamCallback?: (stream: MediaStream) => void
  private onConnectionStateCallback?: (state: string) => void

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

    // 🔁 Listen for remote media stream
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

    // 🔁 Listen for connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      if (this.onConnectionStateCallback && this.peerConnection) {
        this.onConnectionStateCallback(this.peerConnection.connectionState)
      }
    }

    // 🔁 Listen for ICE candidates and send them to the peer
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketManager.sendIceCandidate(event.candidate, this.partnerId)
      }
    }
  }

  async getUserMedia(constraints: MediaStreamConstraints = { video: true, audio: true }) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)

      // ✅ Add local tracks to peer connection
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
      const answer = await this.peerConnection.createAnswer()
      await this.peerConnection.setLocalDescription(answer)
      this.socketManager.sendAnswer(answer, this.partnerId)
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
    } catch (error) {
      console.error("❌ Error handling answer:", error)
    }
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) return
    try {
      await this.peerConnection.addIceCandidate(candidate)
    } catch (error) {
      console.error("❌ Error handling ICE candidate:", error)
    }
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
  }

  getLocalStream() {
    return this.localStream
  }

  getRemoteStream() {
    return this.remoteStream
  }
}
