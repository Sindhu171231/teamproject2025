"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Bell,
  Shield,
  MapPin,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Camera,
  ArrowLeft,
  Save,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "../../contexts/auth-context"
import { useNotifications } from "../../contexts/notification-context"

export default function SettingsPage() {
  const { user } = useAuth()
  const { addNotification } = useNotifications()

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    bio: "",
    dateOfBirth: "",
    gender: "",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderUpdates: true,
    promotions: false,
    newsletter: true,
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    dataSharing: false,
  })

  const [addresses, setAddresses] = useState([
    {
      id: "1",
      type: "Home",
      name: "John Doe",
      address: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      pincode: "10001",
      phone: "+1 234 567 8900",
      isDefault: true,
    },
  ])

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      type: "card",
      last4: "1234",
      brand: "Visa",
      expiryMonth: "12",
      expiryYear: "2025",
      isDefault: true,
    },
  ])

  const [showPassword, setShowPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileSave = () => {
    addNotification({
      user_id: user?.id || "",
      title: "Profile Updated",
      message: "Your profile information has been successfully updated.",
      type: "success",
      read: false,
    })
  }

  const handleNotificationSave = () => {
    addNotification({
      user_id: user?.id || "",
      title: "Notification Settings Updated",
      message: "Your notification preferences have been saved.",
      type: "success",
      read: false,
    })
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addNotification({
        user_id: user?.id || "",
        title: "Password Mismatch",
        message: "New password and confirm password do not match.",
        type: "error",
        read: false,
      })
      return
    }

    addNotification({
      user_id: user?.id || "",
      title: "Password Changed",
      message: "Your password has been successfully updated.",
      type: "success",
      read: false,
    })

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold">Account Settings</h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <p className="text-gray-600">Update your personal information and profile picture</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="mb-2 bg-transparent">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-gray-600">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={profile.gender}
                      onValueChange={(value) => setProfile((prev) => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <Button onClick={handleProfileSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <p className="text-gray-600">Choose how you want to be notified about updates</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="text-base font-medium">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications" className="text-base font-medium">
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, smsNotifications: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications" className="text-base font-medium">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="orderUpdates" className="text-base font-medium">
                        Order Updates
                      </Label>
                      <p className="text-sm text-gray-600">Get notified about order status changes</p>
                    </div>
                    <Switch
                      id="orderUpdates"
                      checked={notifications.orderUpdates}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, orderUpdates: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="promotions" className="text-base font-medium">
                        Promotions & Deals
                      </Label>
                      <p className="text-sm text-gray-600">Receive notifications about special offers</p>
                    </div>
                    <Switch
                      id="promotions"
                      checked={notifications.promotions}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, promotions: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newsletter" className="text-base font-medium">
                        Newsletter
                      </Label>
                      <p className="text-sm text-gray-600">Receive our weekly newsletter</p>
                    </div>
                    <Switch
                      id="newsletter"
                      checked={notifications.newsletter}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, newsletter: checked }))}
                    />
                  </div>
                </div>

                <Button onClick={handleNotificationSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <p className="text-gray-600">Control your privacy and data sharing preferences</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="profileVisibility" className="text-base font-medium">
                      Profile Visibility
                    </Label>
                    <p className="text-sm text-gray-600 mb-2">Who can see your profile information</p>
                    <Select
                      value={privacy.profileVisibility}
                      onValueChange={(value) => setPrivacy((prev) => ({ ...prev, profileVisibility: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showEmail" className="text-base font-medium">
                        Show Email Address
                      </Label>
                      <p className="text-sm text-gray-600">Allow others to see your email address</p>
                    </div>
                    <Switch
                      id="showEmail"
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, showEmail: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showPhone" className="text-base font-medium">
                        Show Phone Number
                      </Label>
                      <p className="text-sm text-gray-600">Allow others to see your phone number</p>
                    </div>
                    <Switch
                      id="showPhone"
                      checked={privacy.showPhone}
                      onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, showPhone: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dataSharing" className="text-base font-medium">
                        Data Sharing
                      </Label>
                      <p className="text-sm text-gray-600">Share anonymized data for analytics</p>
                    </div>
                    <Switch
                      id="dataSharing"
                      checked={privacy.dataSharing}
                      onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, dataSharing: checked }))}
                    />
                  </div>
                </div>

                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Saved Addresses</CardTitle>
                    <p className="text-gray-600">Manage your delivery addresses</p>
                  </div>
                  <Button>Add New Address</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={address.type === "Home" ? "default" : "secondary"}>{address.type}</Badge>
                            {address.isDefault && <Badge variant="outline">Default</Badge>}
                          </div>
                          <p className="font-medium">{address.name}</p>
                          <p className="text-sm text-gray-600">{address.address}</p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-sm text-gray-600">{address.phone}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <p className="text-gray-600">Update your password to keep your account secure</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>

                <Button onClick={handlePasswordChange}>
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <p className="text-gray-600">Add an extra layer of security to your account</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Authentication</p>
                    <p className="text-sm text-gray-600">Receive verification codes via SMS</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Authenticator App</p>
                    <p className="text-sm text-gray-600">Use an authenticator app for verification</p>
                  </div>
                  <Button variant="outline">Setup</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Login Activity</CardTitle>
                <p className="text-gray-600">Recent login activity on your account</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-gray-600">Chrome on Windows • New York, NY</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Mobile App</p>
                        <p className="text-sm text-gray-600">iPhone • 2 hours ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <p className="text-gray-600">Irreversible and destructive actions</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
