"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2, Video, VideoOff, Mic, MicOff, SkipForward, X } from "lucide-react"
import { WebRTCManager } from "@/lib/webrtc"
import { SocketManager, generateUserId } from "@/lib/socket"

type ConnectionState = "connecting" | "connected" | "disconnected" | "error"

export default function ChatPage() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting")
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [nickname, setNickname] = useState<string>("")
  const [partnerNickname, setPartnerNickname] = useState<string>("")
  const [connectionTime, setConnectionTime] = useState(0)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const router = useRouter()
  const socketRef = useRef<SocketManager | null>(null)
  const rtcRef = useRef<WebRTCManager | null>(null)
  const partnerIdRef = useRef<string | null>(null)

  useEffect(() => {
    const storedNickname = localStorage.getItem("bulalink_nickname") || "Anonymous"
    setNickname(storedNickname)

    const userId = generateUserId()
    socketRef.current = new SocketManager(userId, storedNickname)

    const init = async () => {
      await socketRef.current?.connect()
      setupSocketListeners()

      rtcRef.current = new WebRTCManager(socketRef.current!, "temp-id")
      try {
        const stream = await rtcRef.current.getUserMedia()
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        socketRef.current?.findPartner()
        setConnectionState("connecting")
      } catch (err) {
        console.error("🚫 Could not get user media:", err)
        setConnectionState("error")
      }
    }

    init()

    return () => {
      rtcRef.current?.disconnect()
      socketRef.current?.disconnect()
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (connectionState === "connected") {
      interval = setInterval(() => {
        setConnectionTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [connectionState])

  const setupSocketListeners = () => {
    if (!socketRef.current) return

    socketRef.current.onPartnerFound(async ({ partnerId, partnerNickname }) => {
      partnerIdRef.current = partnerId
      setPartnerNickname(partnerNickname || "Stranger")

      rtcRef.current?.onRemoteStream((stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream
        }
      })

      rtcRef.current?.onConnectionStateChange((state) => {
        if (state === "connected") {
          setConnectionState("connected")
          setConnectionTime(0)
        } else if (state === "disconnected") {
          setConnectionState("disconnected")
          setPartnerNickname("")
        }
      })

      try {
        rtcRef.current?.setPartnerId(partnerId)
        const offer = await rtcRef.current?.createOffer()
        if (offer) socketRef.current?.sendOffer(offer, partnerId)
      } catch (error) {
        console.error("Camera/mic access denied", error)
        setConnectionState("error")
      }
    })

    socketRef.current.onOfferReceived(async ({ offer, from }) => {
      partnerIdRef.current = from
      rtcRef.current?.setPartnerId(from)

      try {
        const answer = await rtcRef.current?.createAnswer(offer)
        if (answer) socketRef.current?.sendAnswer(answer, from)
      } catch (error) {
        console.error("Error answering call", error)
        setConnectionState("error")
      }
    })

    socketRef.current.onAnswerReceived(async ({ answer }) => {
      await rtcRef.current?.handleAnswer(answer)
    })

    socketRef.current.onIceCandidateReceived(async ({ candidate }) => {
      await rtcRef.current?.handleIceCandidate(candidate)
    })

    socketRef.current.onPartnerDisconnected(() => {
      rtcRef.current?.disconnect()
      setConnectionState("disconnected")
      setPartnerNickname("")
      partnerIdRef.current = null
    })
  }

  const handleNext = () => {
    rtcRef.current?.disconnect()
    setConnectionState("connecting")
    setPartnerNickname("")
    setConnectionTime(0)
    socketRef.current?.findPartner()
  }

  const handleEnd = () => {
    rtcRef.current?.disconnect()
    socketRef.current?.disconnectFromPartner()
    router.push("/")
  }

  const toggleVideo = () => {
    const stream = rtcRef.current?.getLocalStream()
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    const stream = rtcRef.current?.getLocalStream()
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (connectionState === "error") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Camera Access Required</h2>
          <p className="text-gray-300 mb-6">Please allow camera and microphone access to use BulaLink</p>
          <div className="space-y-3">
            <Button onClick={() => location.reload()} className="w-full">Try Again</Button>
            <Button onClick={handleEnd} variant="outline" className="w-full bg-transparent">Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0">
        {connectionState === "connected" ? (
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              {connectionState === "connecting" && (
                <>
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Connecting you to someone nearby...</h2>
                  <p className="text-gray-300">Finding the perfect chat partner</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 w-24 h-32 md:w-32 md:h-40 bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-white/20">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        {!isVideoEnabled && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <VideoOff className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      {connectionState === "connected" && (
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>{partnerNickname || "Stranger"}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-300">{formatTime(connectionTime)}</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-8">
        <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
          <Button onClick={toggleAudio} size="lg" variant={isAudioEnabled ? "secondary" : "destructive"} className="w-12 h-12 rounded-full p-0">
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>
          <Button onClick={toggleVideo} size="lg" variant={isVideoEnabled ? "secondary" : "destructive"} className="w-12 h-12 rounded-full p-0">
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>
          <Button onClick={handleNext} disabled={connectionState !== "connected"} size="lg" className="bg-sky-500 hover:bg-sky-600 text-white px-6 rounded-full">
            <SkipForward className="w-5 h-5 mr-2" />
            Next
          </Button>
          <Button onClick={handleEnd} size="lg" variant="destructive" className="px-6 rounded-full">
            <X className="w-5 h-5 mr-2" />
            End
          </Button>
        </div>
        {nickname && (
          <div className="text-center mt-4">
            <p className="text-white/70 text-sm">You: {nickname}</p>
          </div>
        )}
      </div>
    </div>
  )
}
