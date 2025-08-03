import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      console.error("Error fetching notifications:", error)
      return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { notificationId, read } = await request.json()

    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("notifications")
      .update({ read })
      .eq("id", notificationId)
      .select()
      .single()

    if (error) {
      console.error("Error updating notification:", error)
      return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}
