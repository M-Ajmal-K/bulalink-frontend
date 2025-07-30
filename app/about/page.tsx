import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Heart, Users, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-emerald-50">
      {/* Header */}
      <header className="p-4 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-sky-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🌊</span>
            </div>
            <h1 className="text-xl font-bold text-sky-800">BulaLink</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-sky-800 mb-4">About BulaLink</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            HIAL THE ASSHOLE FROM BLUMBERG! HINDUUUUU
          </p>
          <h3 className="text-sm text-gray-500 mt-2">
            A simple, anonymous way to meet new people from Fiji
          </h3>
        </div>

        <div className="space-y-8">
          {/* Mission */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-sky-100">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-sky-500" />
              <h3 className="text-xl font-semibold text-gray-800">Our Mission</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              BulaLink was created to bring Fijians together in a digital space where authentic connections can
              flourish. Whether you're in Suva, Nadi, or anywhere around our beautiful islands, BulaLink helps you meet
              new people and share stories through face-to-face video conversations.
            </p>
          </section>

          {/* How It Works */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-sky-100">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-emerald-500" />
              <h3 className="text-xl font-semibold text-gray-800">How It Works</h3>
            </div>
            <div className="space-y-3 text-gray-600">
              <p>
                • <strong>Simple & Anonymous:</strong> No sign-up required. Just click and start chatting.
              </p>
              <p>
                • <strong>Local Connections:</strong> We prioritize connecting you with people from Fiji.
              </p>
              <p>
                • <strong>Safe Environment:</strong> Our community guidelines ensure respectful interactions.
              </p>
              <p>
                • <strong>Mobile First:</strong> Optimized for your phone, perfect for chatting on the go.
              </p>
            </div>
          </section>

          {/* Safety */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-sky-100">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-800">Your Safety Matters</h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              We're committed to creating a safe space for all users. BulaLink includes:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>• Easy reporting and blocking features</p>
              <p>• Community moderation</p>
              <p>• Privacy-focused design</p>
              <p>• Clear community guidelines</p>
            </div>
          </section>

          {/* Values */}
          <section className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-xl p-6 border border-sky-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Our Values</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-2">🤝</div>
                <h4 className="font-semibold text-gray-700">Respect</h4>
                <p className="text-sm text-gray-600">Treating everyone with dignity and kindness</p>
              </div>
              <div>
                <div className="text-2xl mb-2">🌺</div>
                <h4 className="font-semibold text-gray-700">Culture</h4>
                <p className="text-sm text-gray-600">Celebrating our Fijian heritage and diversity</p>
              </div>
              <div>
                <div className="text-2xl mb-2">🔒</div>
                <h4 className="font-semibold text-gray-700">Privacy</h4>
                <p className="text-sm text-gray-600">Protecting your personal information</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Questions or Feedback?</h3>
            <p className="text-gray-600 mb-4">We'd love to hear from you. Help us make BulaLink better for everyone.</p>
            <div className="flex justify-center gap-4">
              <Link href="/guidelines">
                <Button variant="outline" className="text-sky-600 border-sky-300 bg-transparent">
                  Community Guidelines
                </Button>
              </Link>
              <Link href="/">
                <Button className="bg-sky-500 hover:bg-sky-600">Start Chatting</Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
