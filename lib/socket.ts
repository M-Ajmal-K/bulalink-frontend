import { io, Socket } from "socket.io-client"

export interface SocketEvents {
  "user-joined": (data: { userId: string; nickname?: string }) => void
  "user-left": (data: { userId: string }) => void
  offer: (data: { offer: RTCSessionDescriptionInit; from: string }) => void
  answer: (data: { answer: RTCSessionDescriptionInit; from: string }) => void
  "ice-candidate": (data: { candidate: RTCIceCandidateInit; from: string }) => void
  "partner-found": (data: { partnerId: string; partnerNickname?: string }) => void
  "partner-disconnected": () => void
  error: (data: { message: string }) => void
}

// Use environment variable for signaling URL
const SIGNALING_URL = process.env.NEXT_PUBLIC_SIGNALING_URL!

export class SocketManager {
  private socket: Socket | null = null
  private userId: string
  private nickname?: string

  constructor(userId: string, nickname?: string) {
    this.userId = userId
    this.nickname = nickname
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(SIGNALING_URL, {
        query: {
          userId: this.userId,
          nickname: this.nickname,
        },
      })

      this.socket.on("connect", () => {
        console.log(`✅ Socket connected to ${SIGNALING_URL}`)
        resolve()
      })

      this.socket.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err.message)
        reject(err)
      })
    })
  }

  findPartner() {
    if (!this.socket?.connected) {
      console.error("⚠️ Socket not connected")
      return
    }

    this.socket.emit("find-partner", {
      userId: this.userId,
      nickname: this.nickname,
    })
  }

  sendOffer(offer: RTCSessionDescriptionInit, partnerId: string) {
    this.socket?.emit("offer", {
      offer,
      to: partnerId,
      from: this.userId,
    })
  }

  sendAnswer(answer: RTCSessionDescriptionInit, partnerId: string) {
    this.socket?.emit("answer", {
      answer,
      to: partnerId,
      from: this.userId,
    })
  }

  sendIceCandidate(candidate: RTCIceCandidateInit, partnerId: string) {
    this.socket?.emit("ice-candidate", {
      candidate,
      to: partnerId,
      from: this.userId,
    })
  }

  disconnectFromPartner() {
    this.socket?.emit("disconnect-partner", { userId: this.userId })
  }

  disconnect() {
    this.socket?.disconnect()
    console.log("🚪 Socket disconnected")
  }

  onPartnerFound(callback: (data: { partnerId: string; partnerNickname?: string }) => void) {
    this.socket?.on("partner-found", callback)
  }

  onPartnerDisconnected(callback: () => void) {
    this.socket?.on("partner-disconnected", callback)
  }

  onOfferReceived(callback: (data: { offer: RTCSessionDescriptionInit; from: string }) => void) {
    this.socket?.on("offer", callback)
  }

  onAnswerReceived(callback: (data: { answer: RTCSessionDescriptionInit; from: string }) => void) {
    this.socket?.on("answer", callback)
  }

  onIceCandidateReceived(callback: (data: { candidate: RTCIceCandidateInit; from: string }) => void) {
    this.socket?.on("ice-candidate", callback)
  }

  onError(callback: (data: { message: string }) => void) {
    this.socket?.on("error", callback)
  }

  isSocketConnected() {
    return this.socket?.connected || false
  }

  getUserId() {
    return this.userId
  }

  getNickname() {
    return this.nickname
  }

  setNickname(nickname: string) {
    this.nickname = nickname
  }
}

export const generateUserId = () => {
  return "user_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}
