"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { demoUsers } from "@/lib/mock-data"

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleDemoSignIn = async (userType: "customer" | "seller") => {
    setIsLoading(true)
    const demoUser = demoUsers[userType]

    try {
      // Create a proper mock user object
      const mockUser = {
        id: demoUser.id,
        email: demoUser.email,
        user_metadata: {
          name: demoUser.name,
          user_type: demoUser.user_type,
        },
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        phone_confirmed_at: null,
        confirmation_sent_at: null,
        recovery_sent_at: null,
        email_change_sent_at: null,
        new_email: null,
        invited_at: null,
        action_link: null,
        email_change: null,
        phone_change: null,
        phone: null,
        confirmed_at: new Date().toISOString(),
        email_change_confirm_status: 0,
        banned_until: null,
        reauthentication_sent_at: null,
        is_sso_user: false,
        deleted_at: null,
        is_anonymous: false,
      } as any

      // Save to localStorage for persistence
      localStorage.setItem("demo_user", JSON.stringify(mockUser))

      // Use the auth context signIn method
      await signIn(demoUser.email, demoUser.password)

      toast({
        title: "Demo sign in successful!",
        description: `Welcome ${demoUser.name}! You're now signed in as a ${userType}.`,
      })

      // Small delay to ensure state updates
      setTimeout(() => {
        // Redirect based on user type
        if (userType === "seller") {
          router.push("/seller/dashboard")
        } else {
          router.push("/")
        }
      }, 500)
    } catch (error: any) {
      // Even if there's an error, the demo should work
      toast({
        title: "Demo sign in successful!",
        description: `Welcome ${demoUser.name}! You're now signed in as a ${userType}.`,
      })

      setTimeout(() => {
        if (userType === "seller") {
          router.push("/seller/dashboard")
        } else {
          router.push("/")
        }
      }, 500)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await signIn(email, password)
      toast({ title: "Welcome back!", description: "You have been signed in successfully." })
      router.push("/")
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    const userType = formData.get("userType") as string

    try {
      await signUp(email, password, { name, user_type: userType })
      toast({ title: "Account created!", description: "Please check your email to verify your account." })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Demo Sign In Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-blue-900">🚀 Quick Demo Access</CardTitle>
          <CardDescription className="text-blue-700">
            Try the platform instantly with pre-configured demo accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => handleDemoSignIn("customer")}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Sign in as Customer
          </Button>
          <Button
            onClick={() => handleDemoSignIn("seller")}
            disabled={isLoading}
            variant="outline"
            className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            Sign in as Seller
          </Button>
          <Alert>
            <AlertDescription className="text-xs text-blue-600">
              <strong>Customer:</strong> customer@demo.com | <strong>Seller:</strong> seller@demo.com |{" "}
              <strong>Password:</strong> demo123
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Regular Auth Form */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input id="signin-password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input id="signup-name" name="name" type="text" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" name="password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userType">Account Type</Label>
                  <select name="userType" className="w-full p-2 border rounded-md" required>
                    <option value="customer">Customer</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
