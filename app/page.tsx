"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [nickname, setNickname] = useState("")
  const [showNicknameModal, setShowNicknameModal] = useState(false)
  const router = useRouter()

  const handleStartChatting = () => {
    // Store nickname in localStorage if provided
    if (nickname.trim()) {
      localStorage.setItem("bulalink_nickname", nickname.trim())
    }
    setShowNicknameModal(false)
    router.push("/chat")
  }

  const handleQuickStart = () => {
    // Skip nickname and go directly to chat
    router.push("/chat")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-emerald-50 flex flex-col">
      {/* Header */}
      <header className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🌊</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-sky-800">BulaLink</h1>
        </div>
        <p className="text-sky-600 text-lg md:text-xl font-medium">Connect. Chat. VakaBula!</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">🎥</span>
            </div>
            <h2 className="text-xl md:text-2xl text-gray-700 mb-4 leading-relaxed">
              Meet HILAL The Greates Asshole From Blumberg! HINDUUU
            </h2>
          </div>

          {/* Main Action Buttons */}
          <div className="space-y-4 mb-8">
            <Button
              onClick={handleQuickStart}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              Start Chatting
            </Button>

            <Dialog open={showNicknameModal} onOpenChange={setShowNicknameModal}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 text-sky-700 border-sky-300 hover:bg-sky-50 rounded-xl bg-transparent"
                >
                  Add Nickname (Optional)
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-sky-800">Choose a Nickname</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="nickname" className="text-gray-700">
                      Nickname (optional)
                    </Label>
                    <Input
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Enter your nickname..."
                      className="mt-1"
                      maxLength={20}
                    />
                    <p className="text-sm text-gray-500 mt-1">This will be visible to other users</p>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => setShowNicknameModal(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleStartChatting} className="flex-1 bg-sky-500 hover:bg-sky-600">
                      Start Chat
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-sm text-gray-600 leading-relaxed">
            <p className="mb-2">
              By using this service, you agree to our{" "}
              <Link href="/guidelines" className="text-sky-600 hover:text-sky-800 underline">
                community guidelines
              </Link>
            </p>
            <p className="text-xs text-gray-500">Must be 18+ to use this service</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center border-t border-sky-100">
        <div className="flex justify-center gap-6 text-sm">
          <Link href="/about" className="text-sky-600 hover:text-sky-800">
            About BulaLink
          </Link>
          <Link href="/guidelines" className="text-sky-600 hover:text-sky-800">
            Guidelines
          </Link>
        </div>
        <p className="text-xs text-gray-500 mt-2">Connecting Fijians, one conversation at a time</p>
      </footer>
    </div>
  )
}
