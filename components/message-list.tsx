"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Conversation {
  id: string
  name: string
  lastMessage: string
  time: string
  unread: boolean
}

interface MessageListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function MessageList({ conversations, selectedId, onSelect }: MessageListProps) {
  if (conversations.length === 0) {
    return <div className="p-4 text-center text-sm text-muted-foreground">No messages found</div>
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={cn(
            "flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
            selectedId === conversation.id && "bg-muted",
          )}
          onClick={() => onSelect(conversation.id)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className={cn("font-medium truncate", conversation.unread && "font-semibold")}>{conversation.name}</p>
              <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">{conversation.time}</p>
            </div>
            <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
          </div>
          {conversation.unread && (
            <Badge className="rounded-full h-2 w-2 p-0 bg-primary" variant="default">
              <span className="sr-only">Unread message</span>
            </Badge>
          )}
        </div>
      ))}
    </div>
  )
}
