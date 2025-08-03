"use client"

import { Inter } from 'next/font/google'
import "./globals.css"
import { AuthProvider } from "../auth-context"
import { CartProvider } from "../cart-context"
import { WishlistProvider } from "../wishlist-context"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
