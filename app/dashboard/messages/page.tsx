"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserRole } from "@/lib/types"
import { MessageList } from "@/components/message-list"
import { MessageComposer } from "@/components/message-composer"
import { Plus, Search } from "lucide-react"

export default function MessagesPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("inbox")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground">Communicate with organizations and students</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search messages..." className="pl-8" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="inbox" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full rounded-none border-b">
                <TabsTrigger value="inbox">Inbox</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
              <TabsContent value="inbox" className="m-0">
                <MessageList
                  conversations={[
                    {
                      id: "1",
                      name: "Supreme Student Government",
                      lastMessage: "Your clearance request has been received.",
                      time: "2h ago",
                      unread: true,
                    },
                    {
                      id: "2",
                      name: "Computer Science Department",
                      lastMessage: "Please submit your requirements for clearance.",
                      time: "1d ago",
                      unread: false,
                    },
                    {
                      id: "3",
                      name: "Programming Club",
                      lastMessage: "Reminder: Coding competition on June 20.",
                      time: "3d ago",
                      unread: false,
                    },
                  ]}
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
              <TabsContent value="sent" className="m-0">
                <MessageList
                  conversations={[
                    {
                      id: "4",
                      name: "Supreme Student Government",
                      lastMessage: "I would like to request clearance for graduation.",
                      time: "2d ago",
                      unread: false,
                    },
                    {
                      id: "5",
                      name: "Computer Science Department",
                      lastMessage: "When is the deadline for clearance submission?",
                      time: "4d ago",
                      unread: false,
                    },
                  ]}
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                />
              </TabsContent>
              <TabsContent value="archived" className="m-0">
                <div className="p-4 text-center text-sm text-muted-foreground">No archived messages</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="px-6 py-4 border-b">
                <CardTitle className="text-lg">
                  {activeTab === "inbox"
                    ? selectedConversation === "1"
                      ? "Supreme Student Government"
                      : selectedConversation === "2"
                        ? "Computer Science Department"
                        : "Programming Club"
                    : selectedConversation === "4"
                      ? "Supreme Student Government"
                      : "Computer Science Department"}
                </CardTitle>
                <CardDescription>
                  {user.role === UserRole.STUDENT ? "Organization" : "Student conversation"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[500px]">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {selectedConversation === "1" && (
                    <>
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[80%]">
                          <p className="text-sm">Hello, how can I help you today?</p>
                          <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none p-3 max-w-[80%]">
                          <p className="text-sm">I would like to request clearance for graduation.</p>
                          <p className="text-xs text-primary-foreground/70 mt-1">10:32 AM</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[80%]">
                          <p className="text-sm">
                            Your clearance request has been received. We will process it shortly.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">10:35 AM</p>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedConversation === "2" && (
                    <>
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[80%]">
                          <p className="text-sm">
                            Please submit your requirements for clearance. You need to complete the following:
                          </p>
                          <ul className="list-disc list-inside text-sm mt-2">
                            <li>Return all borrowed books to the library</li>
                            <li>Complete the exit interview</li>
                            <li>Submit your final project</li>
                          </ul>
                          <p className="text-xs text-muted-foreground mt-1">Yesterday, 3:45 PM</p>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedConversation === "3" && (
                    <>
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[80%]">
                          <p className="text-sm">
                            Reminder: Coding competition on June 20. Registration closes on June 15. Don't forget to
                            register if you're interested!
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedConversation === "4" && (
                    <>
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none p-3 max-w-[80%]">
                          <p className="text-sm">I would like to request clearance for graduation.</p>
                          <p className="text-xs text-primary-foreground/70 mt-1">2 days ago</p>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedConversation === "5" && (
                    <>
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none p-3 max-w-[80%]">
                          <p className="text-sm">When is the deadline for clearance submission?</p>
                          <p className="text-xs text-primary-foreground/70 mt-1">4 days ago</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <MessageComposer />
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-center p-6">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Select a conversation from the list or start a new message to begin chatting.
              </p>
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                New Message
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
