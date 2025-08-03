import { type NextRequest, NextResponse } from "next/server"
import { getOrdersByCustomerId } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { customerId: string } }) {
  try {
    const customerId = params.customerId

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 })
    }

    const orders = await getOrdersByCustomerId(customerId)
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching customer orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
