import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

export default function GuidelinesPage() {
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
          <h2 className="text-3xl font-bold text-sky-800 mb-4">Community Guidelines</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Creating a safe and respectful environment for all Fijians
          </p>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <section className="bg-sky-50 rounded-xl p-6 border border-sky-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-sky-600" />
              <h3 className="text-xl font-semibold text-sky-800">Welcome to BulaLink</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              BulaLink is a platform for Fijians to connect and build meaningful relationships. By using our service,
              you agree to follow these community guidelines to ensure everyone has a positive and safe experience.
            </p>
          </section>

          {/* Do's */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-800">Do's - What We Encourage</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Be Respectful:</strong> Treat everyone with kindness and respect, regardless of their
                  background
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Be Yourself:</strong> Authentic conversations create the best connections
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Report Issues:</strong> Help us maintain a safe community by reporting inappropriate behavior
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Have Fun:</strong> Enjoy meeting new people and sharing your culture
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Protect Privacy:</strong> Don't share personal information like addresses or phone numbers
                </p>
              </div>
            </div>
          </section>

          {/* Don'ts */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-semibold text-gray-800">Don'ts - Prohibited Behavior</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>No Harassment:</strong> Bullying, threats, or persistent unwanted contact
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>No Inappropriate Content:</strong> Sexual content, nudity, or explicit material
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>No Hate Speech:</strong> Discrimination based on race, religion, gender, or other
                  characteristics
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>No Spam or Scams:</strong> Commercial promotion, fake profiles, or fraudulent activity
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>No Illegal Activity:</strong> Anything that violates local or international laws
                </p>
              </div>
            </div>
          </section>

          {/* Age Requirement */}
          <section className="bg-amber-50 rounded-xl p-6 border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-800 mb-3">Age Requirement</h3>
            <p className="text-amber-700">
              You must be at least 18 years old to use BulaLink. This platform is designed for adult conversations and
              connections.
            </p>
          </section>

          {/* Reporting */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Reporting & Safety</h3>
            <div className="space-y-3 text-gray-700">
              <p>If you encounter inappropriate behavior:</p>
              <div className="pl-4 space-y-2">
                <p>• Use the "Report" button during your chat</p>
                <p>• End the conversation immediately if you feel unsafe</p>
                <p>• Block users who violate these guidelines</p>
                <p>• Contact our support team for serious violations</p>
              </div>
            </div>
          </section>

          {/* Consequences */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Consequences</h3>
            <p className="text-gray-700 mb-3">Violations of these guidelines may result in:</p>
            <div className="space-y-2 text-gray-700 pl-4">
              <p>• Warning messages</p>
              <p>• Temporary suspension from the platform</p>
              <p>• Permanent ban for serious or repeated violations</p>
              <p>• Reporting to authorities for illegal activities</p>
            </div>
          </section>

          {/* Footer */}
          <section className="text-center pt-6">
            <p className="text-gray-600 mb-4">
              These guidelines help us maintain BulaLink as a welcoming space for all Fijians. Thank you for being part
              of our community!
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/about">
                <Button variant="outline" className="text-sky-600 border-sky-300 bg-transparent">
                  About BulaLink
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
