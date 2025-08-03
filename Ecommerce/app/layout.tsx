import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./clientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trendify - Modern E-commerce Platform",
  description: "Discover trending products with amazing deals and fast delivery",
  keywords: "ecommerce, shopping, deals, fashion, electronics, home",
  authors: [{ name: "Trendify Team" }],
  creator: "Trendify",
  publisher: "Trendify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://trendify.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Trendify - Modern E-commerce Platform",
    description: "Discover trending products with amazing deals and fast delivery",
    url: "https://trendify.vercel.app",
    siteName: "Trendify",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Trendify - Modern E-commerce Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trendify - Modern E-commerce Platform",
    description: "Discover trending products with amazing deals and fast delivery",
    images: ["/twitter-image.jpg"],
    creator: "@trendify",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
