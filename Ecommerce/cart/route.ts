import { type NextRequest, NextResponse } from "next/server"
import { getCartItems, addToCart, updateCartQuantity, removeFromCart } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 })
    }

    const cartItems = await getCartItems(customerId)
    return NextResponse.json(cartItems)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customerId, productId, quantity } = await request.json()

    if (!customerId || !productId) {
      return NextResponse.json({ error: "Customer ID and Product ID required" }, { status: 400 })
    }

    const cartItem = await addToCart(customerId, productId, quantity)
    return NextResponse.json(cartItem)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { customerId, productId, quantity } = await request.json()

    if (!customerId || !productId || quantity === undefined) {
      return NextResponse.json({ error: "Customer ID, Product ID, and quantity required" }, { status: 400 })
    }

    const cartItem = await updateCartQuantity(customerId, productId, quantity)
    return NextResponse.json(cartItem)
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")
    const productId = searchParams.get("productId")

    if (!customerId || !productId) {
      return NextResponse.json({ error: "Customer ID and Product ID required" }, { status: 400 })
    }

    await removeFromCart(customerId, productId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}
