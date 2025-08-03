"use client"

import { useState } from "react"

// Email data interface
export interface EmailData {
  id: string
  to: string
  subject: string
  content: string
  timestamp: Date
  status: "sent" | "pending" | "failed"
}

// Order data interface for email templates
interface OrderData {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: string
  shippingAddress: {
    fullName: string
    address: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  paymentMethod: string
  deliveryOption: string
  specialInstructions?: string
}

// Email service class
class EmailService {
  private static instance: EmailService
  private sentEmails: EmailData[] = []

  private constructor() {}

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendEmail(emailData: Omit<EmailData, "id" | "timestamp" | "status">): Promise<EmailData> {
    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const email: EmailData = {
      ...emailData,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: "sent",
    }

    this.sentEmails.push(email)
    console.log("Email sent:", email)
    return email
  }

  generateOrderConfirmationEmail(orderData: OrderData): Omit<EmailData, "id" | "timestamp" | "status"> {
    const subject = `Order Confirmation - ${orderData.orderId}`
    const content = this.generateOrderConfirmationHTML(orderData)

    return {
      to: orderData.customerEmail,
      subject,
      content,
    }
  }

  generateWelcomeEmail(userEmail: string, userName: string): Omit<EmailData, "id" | "timestamp" | "status"> {
    const subject = "Welcome to Trendify!"
    const content = this.generateWelcomeHTML(userName)

    return {
      to: userEmail,
      subject,
      content,
    }
  }

  generateNewsletterEmail(
    userEmail: string,
    userName: string,
    deals: any[],
  ): Omit<EmailData, "id" | "timestamp" | "status"> {
    const subject = "🔥 Hot Deals This Week - Don't Miss Out!"
    const content = this.generateNewsletterHTML(userName, deals)

    return {
      to: userEmail,
      subject,
      content,
    }
  }

  private generateOrderConfirmationHTML(orderData: OrderData): string {
    const itemsHTML = orderData.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `,
      )
      .join("")

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for your purchase</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${orderData.customerName},</p>
          
          <p style="margin-bottom: 20px;">Your order has been confirmed and will be processed soon. Here are your order details:</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">Order #${orderData.orderId}</h3>
            <p style="margin: 0; color: #6b7280;">Placed on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          
          <div style="text-align: right; margin-bottom: 20px;">
            <p style="font-size: 18px; font-weight: bold; color: #059669;">Total: ₹${orderData.total}</p>
          </div>
          
          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Shipping Address</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; font-weight: bold;">${orderData.shippingAddress.fullName}</p>
            <p style="margin: 5px 0;">${orderData.shippingAddress.address}</p>
            <p style="margin: 5px 0;">${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.pincode}</p>
            <p style="margin: 5px 0;">Phone: ${orderData.shippingAddress.phone}</p>
          </div>
          
          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Payment & Delivery</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0;"><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
            <p style="margin: 5px 0;"><strong>Delivery Option:</strong> ${orderData.deliveryOption}</p>
            ${orderData.specialInstructions ? `<p style="margin: 5px 0;"><strong>Special Instructions:</strong> ${orderData.specialInstructions}</p>` : ""}
          </div>
          
          <div style="background: #ecfdf5; border: 1px solid #d1fae5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #065f46;"><strong>What's Next?</strong></p>
            <p style="margin: 5px 0 0 0; color: #065f46;">We'll send you a tracking number once your order ships. You can also track your order in your account dashboard.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Track Your Order</a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
            <p>Need help? Contact our support team at support@trendify.com</p>
            <p style="margin: 10px 0;">Thank you for shopping with Trendify!</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private generateWelcomeHTML(userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Trendify</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to Trendify!</h1>
          <p style="color: white; margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">Your ultimate shopping destination</p>
        </div>
        
        <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 18px; margin-bottom: 20px;">Hi ${userName},</p>
          
          <p style="margin-bottom: 25px; font-size: 16px;">Welcome to the Trendify family! We're excited to have you on board and can't wait to help you discover amazing products from trusted sellers.</p>
          
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0;">
            <h3 style="margin: 0 0 10px 0; color: #0c4a6e;">🎉 Get Started</h3>
            <p style="margin: 0; color: #0c4a6e;">Explore thousands of products across categories like Electronics, Fashion, Home & Garden, and more!</p>
          </div>
          
          <h3 style="color: #374151; margin: 30px 0 15px 0;">What you can do:</h3>
          <ul style="color: #4b5563; margin-bottom: 25px;">
            <li style="margin-bottom: 8px;">🛍️ Browse and shop from thousands of products</li>
            <li style="margin-bottom: 8px;">❤️ Save your favorite items to your wishlist</li>
            <li style="margin-bottom: 8px;">🚚 Enjoy fast and reliable delivery</li>
            <li style="margin-bottom: 8px;">💬 Get 24/7 customer support</li>
            <li style="margin-bottom: 8px;">🔔 Receive notifications about deals and offers</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Start Shopping Now</a>
          </div>
          
          <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="margin: 0 0 10px 0; color: #92400e;">💡 Pro Tip</h4>
            <p style="margin: 0; color: #92400e;">Follow us on social media and subscribe to our newsletter to get exclusive deals and early access to sales!</p>
          </div>
          
          <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
            <p>Questions? We're here to help! Contact us at support@trendify.com</p>
            <p style="margin: 15px 0;">Happy Shopping!</p>
            <p style="font-weight: bold; color: #374151;">The Trendify Team</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private generateNewsletterHTML(userName: string, deals: any[]): string {
    const dealsHTML = deals
      .slice(0, 3)
      .map(
        (deal) => `
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
        <img src="${deal.image}" alt="${deal.name}" style="width: 100%; height: 200px; object-fit: cover;">
        <div style="padding: 15px;">
          <h4 style="margin: 0 0 8px 0; color: #374151;">${deal.name}</h4>
          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">${deal.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 18px; font-weight: bold; color: #dc2626;">₹${deal.price}</span>
            <span style="font-size: 14px; color: #6b7280; text-decoration: line-through;">₹${deal.originalPrice}</span>
          </div>
        </div>
      </div>
    `,
      )
      .join("")

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hot Deals This Week</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔥 Hot Deals This Week!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Don't miss these amazing offers</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>
          
          <p style="margin-bottom: 25px;">We've handpicked some incredible deals just for you! These offers won't last long, so grab them while you can.</p>
          
          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Featured Deals</h3>
          
          ${dealsHTML}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">View All Deals</a>
          </div>
          
          <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="margin: 0 0 10px 0; color: #991b1b;">⏰ Limited Time Offers</h4>
            <p style="margin: 0; color: #991b1b;">These deals expire soon! Don't wait too long to make your purchase.</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
            <p>Want to unsubscribe? <a href="#" style="color: #6b7280;">Click here</a></p>
            <p style="margin: 10px 0;">Happy Shopping with Trendify!</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  getSentEmails(): EmailData[] {
    return [...this.sentEmails]
  }
}

// React hook for using the email service
export function useEmailService() {
  const [isLoading, setIsLoading] = useState(false)
  const [sentEmails, setSentEmails] = useState<EmailData[]>([])

  const emailService = EmailService.getInstance()

  const sendEmail = async (emailData: Omit<EmailData, "id" | "timestamp" | "status">) => {
    setIsLoading(true)
    try {
      const result = await emailService.sendEmail(emailData)
      setSentEmails((prev) => [result, ...prev])
      return result
    } finally {
      setIsLoading(false)
    }
  }

  const sendOrderConfirmation = async (orderData: OrderData) => {
    const emailData = emailService.generateOrderConfirmationEmail(orderData)
    return await sendEmail(emailData)
  }

  const sendWelcomeEmail = async (userEmail: string, userName: string) => {
    const emailData = emailService.generateWelcomeEmail(userEmail, userName)
    return await sendEmail(emailData)
  }

  const sendNewsletterEmail = async (userEmail: string, userName: string, deals: any[]) => {
    const emailData = emailService.generateNewsletterEmail(userEmail, userName, deals)
    return await sendEmail(emailData)
  }

  const generateOrderConfirmationEmail = (orderData: OrderData) => {
    return emailService.generateOrderConfirmationEmail(orderData)
  }

  return {
    sendEmail,
    sendOrderConfirmation,
    sendWelcomeEmail,
    sendNewsletterEmail,
    generateOrderConfirmationEmail,
    sentEmails,
    isLoading,
  }
}

export default EmailService
