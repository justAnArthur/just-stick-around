import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import type { ReactNode } from "react"

import "@/styles/globals.css"
import { Providers } from "./providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Just Stick Around",
  description:
    "Web application (cross-platform) to discover and explore new places and sticking them into your digital profile as stickers on luggage."
}

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width"
}

export default function RootLayout({
                                     children
                                   }: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} flex min-h-svh flex-col antialiased overflow-hidden`}
    >
    <Providers>
      {children}
    </Providers>
    </body>
    </html>
  )
}
