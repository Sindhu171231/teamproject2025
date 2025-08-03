import { type NextRequest, NextResponse } from "next/server"
import { createOrder } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order, items } = body

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    const orderData = {
      ...order,
      order_number: orderNumber,
    }

    const newOrder = await createOrder(orderData, items)

    return NextResponse.json(newOrder)
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
