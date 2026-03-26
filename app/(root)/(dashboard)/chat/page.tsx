"use client";
import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  MoreVertical,
  PhoneMissed,
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

const AiChatPage = () => {
  const [selectedConversation, setSelectedConversation] =
    useState<IConversation | null>(null);

  const { conversations, loading: convoLoading } = useConversations();

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

  return (
    <div className="h-full flex bg-background dark:bg-neutral-900 text-black dark:text-white">
      {/* Sidebar */}
      <div className="w-full max-w-xs  bg-background dark:bg-neutral-950 rounded-md border border-border dark:border-zinc-700 flex flex-col">
        {/* Header */}
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chats</h2>
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800">
            +
          </button>
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

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConvos.map((chat, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedConversation(chat);
              }}
              className="px-4 border-b  py-3 flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-zinc-800 cursor-pointer"
            >
              {/* Avatar */}
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session?.user?.image ?? undefined}
                  alt="Avatar"
                />
                <AvatarFallback>{chat.sender?.name[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white">
                {chat.sender?.image || chat.sender?.name[0] || "U"}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-sm">
                  <span className="font-medium truncate">
                    {chat.sender?.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(
                      chat.lastMessage?.createdAt ?? new Date(),
                    ).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center">
                  {chat.lastMessage?.senderId !== session?.user?.id && (
                    <span className="mr-1 flex">
                      {chat.lastMessage?.isRead ? (
                        <CheckCheck className="text-cyan-500" size={16} />
                      ) : (
                        <Check className="text-foreground/40" size={16} />
                      )}
                    </span>
                  )}
                  <p className=" mr-2 flex-1 text-sm text-gray-500 truncate">
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
      </div>

      {/* Chat Area */}
      <ChatArea selectedConversation={selectedConversation} />
    </div>
  );
};

export default AiChatPage;
