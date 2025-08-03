"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { OrderProvider } from "@/contexts/order-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  ChevronDown,
  Package,
  Settings,
  LogOut,
  Store,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useNotifications } from "@/contexts/notification-context"
import { NotificationDropdown } from "@/components/NotificationDropdown"
import { LocationSelector } from "@/components/LocationSelector"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

function Header() {
  const { user, logout } = useAuth()
  const { items, getTotalItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { getUnreadCount } = useNotifications()

  const totalCartItems = getTotalItems()
  const totalWishlistItems = wishlistItems.length
  const unreadNotifications = getUnreadCount()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col gap-4 py-4">
                <Link href="/" className="text-lg font-semibold">
                  Trendify
                </Link>
                <div className="space-y-2">
                  <Link href="/hot-deals" className="block py-2 text-sm hover:text-primary">
                    Hot Deals
                  </Link>
                  <Link href="/categories/electronics" className="block py-2 text-sm hover:text-primary">
                    Electronics
                  </Link>
                  <Link href="/categories/fashion" className="block py-2 text-sm hover:text-primary">
                    Fashion
                  </Link>
                  <Link href="/categories/home-garden" className="block py-2 text-sm hover:text-primary">
                    Home & Garden
                  </Link>
                  <Link href="/categories/sports" className="block py-2 text-sm hover:text-primary">
                    Sports
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Trendify</span>
          </Link>

          {/* Location Selector */}
          <div className="hidden md:flex items-center gap-2">
            <LocationSelector />
            <span className="text-sm text-muted-foreground">Free shipping on orders over ₹999</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link href="/hot-deals" className="text-sm font-medium hover:text-primary transition-colors">
              Hot Deals
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                Categories
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/categories/electronics">Electronics</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categories/fashion">Fashion</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categories/home-garden">Home & Garden</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categories/sports">Sports</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search for products..." className="pl-10 pr-4" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {user && <NotificationDropdown />}

            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/customer/wishlist">
                <Heart className="h-5 w-5" />
                {totalWishlistItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalWishlistItems}
                  </Badge>
                )}
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalCartItems}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Help & Support Link */}
            <Link href="/support" className="hidden md:block text-sm text-muted-foreground hover:text-foreground">
              Help & Support
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {user.role === "customer" ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/customer/dashboard">
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/customer/orders">
                          <Package className="mr-2 h-4 w-4" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/seller/dashboard">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Seller Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/seller/products">
                          <Package className="mr-2 h-4 w-4" />
                          My Products
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <WishlistProvider>
              <OrderProvider>
                <Header />
                <main>{children}</main>
                <Toaster position="top-right" richColors />
              </OrderProvider>
            </WishlistProvider>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
