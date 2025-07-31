import { SocketManager } from "./socket"

// Parse STUN and TURN servers from environment
const parseICEServers = (): RTCIceServer[] => {
  const servers: RTCIceServer[] = [];

  // STUN servers
  const stunEnv = process.env.NEXT_PUBLIC_STUN_SERVERS || "";
  stunEnv.split(",")
    .map(url => url.trim())
    .filter(url => url.length)
    .forEach(url => servers.push({ urls: url }));

  // TURN server
  const turnUrl = process.env.NEXT_PUBLIC_TURN_SERVER_URL;
  const turnUser = process.env.NEXT_PUBLIC_TURN_SERVER_USER;
  const turnPass = process.env.NEXT_PUBLIC_TURN_SERVER_PASS;
  if (turnUrl && turnUser && turnPass) {
    servers.push({
      urls: turnUrl,
      username: turnUser,
      credential: turnPass,
    });
  }

  return servers;
}

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

  setPartnerId(id: string) {
    this.partnerId = id
  }

  private initializePeerConnection() {
    const config: RTCConfiguration = {
      iceServers: parseICEServers(),
    }

    this.peerConnection = new RTCPeerConnection(config)

    this.peerConnection.ontrack = (event) => {
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream()
      }
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream!.addTrack(track)
      })
      console.log("🎥 ontrack fired, remoteStream tracks:", this.remoteStream?.getTracks())
      this.onRemoteStreamCallback?.(this.remoteStream!)
    }

    this.peerConnection.onconnectionstatechange = () => {
      console.log("🔗 Connection state:", this.peerConnection?.connectionState)
      if (this.peerConnection) {
        this.onConnectionStateCallback?.(this.peerConnection.connectionState)
      }
    }

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("🥶 Sending ICE candidate:", event.candidate)
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
      console.log("✅ Added local tracks:", this.localStream?.getTracks())
      return this.localStream
    } catch (error) {
      console.error("❌ Error accessing media devices:", error)
      throw error
    }
  }

  async createOffer() {
    if (!this.peerConnection) return null

    try {
      console.log("💡 Creating offer")
      const offer = await this.peerConnection.createOffer()
      await this.peerConnection.setLocalDescription(offer)
      console.log("📋 Local description set (offer):", offer)
      return offer
    } catch (error) {
      console.error("❌ Error creating offer:", error)
      return null
    }
  }

  async createAnswer(offer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) return null

    try {
      console.log("📞 Received offer, setting remote description", offer)
      await this.peerConnection.setRemoteDescription(offer)
      this.isRemoteDescriptionSet = true

      const answer = await this.peerConnection.createAnswer()
      await this.peerConnection.setLocalDescription(answer)
      console.log("📋 Local description set (answer):", answer)

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
      console.log("📞 Received answer, setting remote description", answer)
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
      console.log("⏳ Queueing ICE candidate until remote description is set", candidate)
      this.pendingIceCandidates.push(candidate)
      return
    }

    try {
      console.log("🥶 Adding ICE candidate:", candidate)
      await this.peerConnection.addIceCandidate(candidate)
    } catch (error) {
      console.error("❌ Error handling ICE candidate:", error)
    }
  }

  private async flushPendingIceCandidates() {
    for (const candidate of this.pendingIceCandidates) {
      try {
        console.log("🚚 Flushing pending ICE candidate:", candidate)
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
