import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BulaLink - Connect. Chat. VakaBula!",
  description:
    "Random video chat platform connecting local Fijians. Meet new people through face-to-face conversations.",
  keywords: "Fiji, video chat, random chat, Fijian, connect, social, mobile",
  authors: [{ name: "BulaLink Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  generator: "v0.dev",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const themeColor = "#0ea5e9"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BulaLink" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
