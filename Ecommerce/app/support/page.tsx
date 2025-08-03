"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Phone, Mail, MessageCircle, Clock, Search, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { useNotifications } from "../../contexts/notification-context"

const faqs = [
  {
    question: "How do I track my order?",
    answer:
      "You can track your order by going to 'My Orders' in your account dashboard or using the tracking link sent to your email.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most items. Items must be in original condition with tags attached.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days, and Free shipping takes 7-10 business days.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "You can cancel your order within 1 hour of placing it. After that, please contact customer support for assistance.",
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we only ship within India. We're working on expanding to international markets soon.",
  },
  {
    question: "How do I change my delivery address?",
    answer:
      "You can change your delivery address before the order is shipped by contacting customer support or through your order details page.",
  },
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    orderNumber: "",
  })
  const { addNotification } = useNotifications()

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate form submission
    addNotification({
      user_id: "current-user",
      title: "Support Request Submitted",
      message: "We've received your message and will respond within 24 hours.",
      type: "success",
      read: false,
    })

    // Reset form
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      orderNumber: "",
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
            <h1 className="text-2xl font-bold">Help & Support</h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4">How can we help you?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 text-sm mb-3">Mon-Fri 9AM-6PM</p>
              <p className="font-medium text-green-600">1800-123-4567</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600 text-sm mb-3">Available 24/7</p>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Online
              </Badge>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-gray-600 text-sm mb-3">Response in 24 hours</p>
              <p className="font-medium text-purple-600">support@trendify.com</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search for answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ List */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No FAQs found matching your search.</p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>

            {/* Popular Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Orders & Shipping</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="#" className="text-blue-600 hover:underline">
                          Track your order
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-blue-600 hover:underline">
                          Shipping information
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-blue-600 hover:underline">
                          Order modifications
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Returns & Refunds</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="#" className="text-blue-600 hover:underline">
                          Return policy
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-blue-600 hover:underline">
                          Refund process
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-blue-600 hover:underline">
                          Exchange items
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Account & Payment</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="#" className="text-blue-600 hover:underline">
                          Account settings
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-blue-600 hover:underline">
                          Payment methods
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-blue-600 hover:underline">
                          Security
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Products & Services</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="#" className="text-blue-600 hover:underline">
                          Product information
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-blue-600 hover:underline">
                          Warranty
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-blue-600 hover:underline">
                          Technical support
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <p className="text-gray-600">We'll get back to you within 24 hours</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="orderNumber">Order Number (Optional)</Label>
                      <Input
                        id="orderNumber"
                        value={contactForm.orderNumber}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, orderNumber: e.target.value }))}
                        placeholder="ORD-123456"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-gray-600">1800-123-4567</p>
                        <p className="text-xs text-gray-500">Mon-Fri 9AM-6PM IST</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-gray-600">support@trendify.com</p>
                        <p className="text-xs text-gray-500">Response within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-gray-600">Available 24/7</p>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          Online
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span>10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Times</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Live Chat: Immediate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Phone: Within 2 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Email: Within 24 hours</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
