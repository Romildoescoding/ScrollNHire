"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Loader2,
  MoreVertical,
  PhoneMissed,
  Plus,
  Search,
  Send,
  User2,
  Video,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SenderMessage from "@/components/sender-message";
import UserMessage from "@/components/receiver-message";
import useConversations, { IConversation } from "@/app/hooks/useConversations";
import useMessages from "@/app/hooks/useMessages";
import { useSession } from "next-auth/react";
import ChatArea from "@/components/chat-area";
import { Button } from "@/components/ui/button";
import { ModalAddChat } from "@/components/modal-add-chat";
import { socket } from "@/app/_lib/socket";
import axios from "axios";

export function formatMessageTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (isYesterday) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
}

const AiChatPage = () => {
  const [selectedConversation, setSelectedConversation] =
    useState<IConversation | null>(null);

  const {
    conversations,
    setConversations,
    refetch,
    loading: convoLoading,
  } = useConversations();

  const { data: session } = useSession();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredConvos = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return conversations;

    return conversations.filter(
      (convo) =>
        convo.sender.name.toLowerCase().includes(query) ||
        convo.lastMessage?.message?.toLowerCase().includes(query),
    );
  }, [conversations, searchQuery]);

  useEffect(() => {
    socket.on("conversation_updated", async ({ conversationId, message }) => {
      let found = false;

      setConversations((prev) => {
        const index = prev.findIndex((c) => c._id === conversationId);

        if (index !== -1) {
          found = true;

          const updated = [...prev];
          const convo = updated[index];

          const updatedConvo = {
            ...convo,
            lastMessage: {
              message: message.text,
              createdAt: message.createdAt,
              senderId: message.senderId,
              isRead: false,
            },
          };

          updated.splice(index, 1);
          return [updatedConvo, ...updated];
        }

        return prev;
      });

      if (!found) {
        try {
          const res = await axios.get(`/api/conversations/${conversationId}`);
          const newConvo = res.data?.data;

          setConversations((prev) => {
            if (prev.some((c) => c._id === newConvo._id)) return prev;
            return [newConvo, ...prev];
          });
        } catch (err) {
          console.error("Error fetching new conversation:", err);
        }
      }

      return () => {
        socket.off("conversation_updated");
      };
    });
  }, []);

  useEffect(() => {
    socket.on("conversation_created", async ({ conversationId }) => {
      const res = await axios.get(`/api/conversations/${conversationId}`);
      const convo = res.data.data;

      setConversations((prev) => {
        if (prev.some((c) => c._id === convo._id)) return prev;
        return [convo, ...prev];
      });
    });
    return () => socket.off("conversation_created");
  }, []);

  return (
    <div className="h-full flex bg-background dark:bg-[#0f0f12] pl-2 pb-4 rounded-lg text-black dark:text-white">
      {/* Sidebar */}
      <div className="w-full max-w-xs bg-background dark:bg-zinc-950 rounded-lg border border-border  flex flex-col">
        {/* Header */}
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chats</h2>
          {session?.user?.role === "employer" && (
            <ModalAddChat
              refetch={refetch}
              setConversations={setConversations}
            />
          )}
        </div>

        {/* Search */}
        <div className="border-b p-4">
          <div className="relative">
            {/* Icon */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />

            {/* Input */}
            <Input
              type="text"
              placeholder="Search chats..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {convoLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {filteredConvos.map((chat, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedConversation(chat);
                }}
                className="px-4 border-b  py-3 flex items-center gap-3 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
              >
                {/* Avatar */}
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={chat.sender?.image ?? undefined}
                    alt="Avatar"
                  />
                  <AvatarFallback>{chat.sender?.name[0] || "U"}</AvatarFallback>
                </Avatar>
                {/* <div className="w-10 h-10 rounded-full bg-zinc-400 flex items-center justify-center text-white">
                  {chat.sender?.image || chat.sender?.name[0] || "U"}
                </div> */}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium truncate">
                      {chat.sender?.name}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {chat.lastMessage?.createdAt &&
                        formatMessageTime(chat.lastMessage.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {chat.lastMessage?.senderId === session?.user?.id &&
                      typeof chat.lastMessage?.isRead === "boolean" && (
                        <span className="mr-1 flex">
                          {chat.lastMessage?.isRead ? (
                            <CheckCheck className="text-cyan-500" size={16} />
                          ) : (
                            <Check className="text-foreground/40" size={16} />
                          )}
                        </span>
                      )}
                    <p className=" mr-2 flex-1 text-sm text-zinc-500 truncate">
                      {chat.lastMessage?.message ||
                        "Click to start conversation."}
                    </p>
                    {/* Unread */}
                    {chat.unreadMessagesCount > 0 && (
                      <div className="min-w-5 h-5 text-xs flex items-center justify-center bg-cyan-500 text-white rounded-full">
                        {chat.unreadMessagesCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <ChatArea
        selectedConversation={selectedConversation}
        setConversations={setConversations}
      />
    </div>
  );
};

export default AiChatPage;
