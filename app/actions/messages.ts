"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getConversations(userId: string) {
  const supabase = getSupabaseServerClient()

  // Get all messages where the user is either sender or receiver
  const { data: messages, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:sender_id (id, name, email),
      receiver:receiver_id (id, name, email)
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching conversations:", error)
    throw new Error("Failed to fetch conversations")
  }

  // Group messages by conversation partner
  const conversations = new Map()

  messages.forEach((message) => {
    const isUserSender = message.sender_id === userId
    const partnerId = isUserSender ? message.receiver_id : message.sender_id
    const partner = isUserSender ? message.receiver : message.sender

    if (!partnerId || !partner) return

    if (!conversations.has(partnerId)) {
      conversations.set(partnerId, {
        id: partnerId,
        name: partner.name,
        email: partner.email,
        lastMessage: message.content,
        time: message.created_at,
        unread: !isUserSender && !message.read,
      })
    }
  })

  return Array.from(conversations.values())
}

export async function getMessagesByConversation(userId: string, partnerId: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`,
    )
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching messages:", error)
    throw new Error("Failed to fetch messages")
  }

  // Mark messages as read
  const unreadMessages = data.filter((msg) => msg.receiver_id === userId && !msg.read)

  if (unreadMessages.length > 0) {
    const unreadIds = unreadMessages.map((msg) => msg.id)

    await supabase.from("messages").update({ read: true }).in("id", unreadIds)

    revalidatePath("/dashboard/messages")
  }

  return data
}

export async function sendMessage(senderId: string, receiverId: string, content: string) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase.from("messages").insert({
    sender_id: senderId,
    receiver_id: receiverId,
    content,
    read: false,
  })

  if (error) {
    console.error("Error sending message:", error)
    throw new Error("Failed to send message")
  }

  // Create notification for receiver
  await supabase.from("notifications").insert({
    user_id: receiverId,
    title: "New Message",
    message: "You have received a new message.",
    type: "message",
    related_id: senderId,
  })

  revalidatePath("/dashboard/messages")
}
