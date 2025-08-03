import { type NextRequest, NextResponse } from "next/server"
import { getWishlistItems, addToWishlist, removeFromWishlist } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 })
    }

    const wishlistItems = await getWishlistItems(customerId)
    return NextResponse.json(wishlistItems)
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customerId, productId } = await request.json()

    if (!customerId || !productId) {
      return NextResponse.json({ error: "Customer ID and Product ID required" }, { status: 400 })
    }

    const wishlistItem = await addToWishlist(customerId, productId)
    return NextResponse.json(wishlistItem)
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
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

    await removeFromWishlist(customerId, productId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 })
  }
}
