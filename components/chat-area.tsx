import {
  ArrowLeft,
  MoreVertical,
  PhoneMissed,
  Send,
  User2,
  Video,
} from "lucide-react";
import React from "react";
import UserMessage from "./receiver-message";
import SenderMessage from "./sender-message";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";
import { IConversation } from "@/app/hooks/useConversations";
import useMessages from "@/app/hooks/useMessages";
import Image from "next/image";

const ChatArea = ({
  selectedConversation,
}: {
  selectedConversation: IConversation | null;
}) => {
  const { data: session } = useSession();

  const {
    messages,
    setMessages,
    loading: messagesLoading,
  } = useMessages(selectedConversation?._id || null);

  return (
    <>
      {!selectedConversation && (
        <div className="flex flex-1 items-center justify-center bg-background dark:bg-[#0f0f12]">
          <Image
            alt="shadcn/ui"
            loading="lazy"
            width="200"
            height="200"
            className="hidden max-w-sm dark:block"
            style={{ color: "transparent" }}
            src="/not-selected-chat-light.svg"
          />
          <Image
            alt="shadcn/ui"
            loading="lazy"
            width="200"
            height="200"
            className="block max-w-sm dark:hidden"
            style={{ color: "transparent" }}
            src="/not-selected-chat.svg"
          />
        </div>
      )}
      {selectedConversation && (
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center gap-4 px-4 py-3">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Back Button (mobile only) */}
              <button className="flex lg:hidden items-center justify-center w-10 h-10 rounded-md border bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700">
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Avatar */}
              <div className="relative w-10 h-10">
                <Avatar className="h-full w-full">
                  <AvatarImage
                    src={selectedConversation?.sender.image ?? undefined}
                    alt="Avatar"
                  />
                  <AvatarFallback>
                    <User2 size={20} />
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900" />
              </div>

              {/* Name + Status */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {selectedConversation?.sender.name}
                </span>
                {/* <span className="text-xs text-green-500">{selectedConversation?.sender.status}</span> */}
                <span className="text-xs text-green-500">Online</span>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-md border bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700">
                  <Video className="w-4 h-4" />
                </button>

                <button className="w-9 h-9 flex items-center justify-center rounded-md border bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700">
                  <PhoneMissed className="w-4 h-4" />
                </button>
              </div>

              {/* More Menu */}
              <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Incoming */}
            {messages.map((msg) =>
              msg.senderId !== session?.user?.id ? (
                <SenderMessage
                  key={msg._id}
                  text={msg.text}
                  user={{}}
                  setReply={() => {}}
                />
              ) : (
                <UserMessage key={msg._id} text={msg.text} user={{}} />
              ),
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-zinc-700 flex gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none"
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2 hover:bg-blue-600">
              <Send size={16} />
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatArea;
