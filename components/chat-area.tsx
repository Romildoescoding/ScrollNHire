import {
  ArrowLeft,
  MoreVertical,
  PhoneMissed,
  Send,
  User2,
  Video,
} from "lucide-react";
import React, { useEffect, useRef } from "react";
import UserMessage from "./receiver-message";
import SenderMessage from "./sender-message";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";
import { IConversation } from "@/app/hooks/useConversations";
import useMessages from "@/app/hooks/useMessages";
import Image from "next/image";
import ChatInputForm from "./chat-input-form";
import useSendMessage from "@/app/hooks/useSendMessage";

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

  const { sendMessage } = useSendMessage();

  async function handleSendMessage(message: string) {
    if (!selectedConversation) return;
    const msg = await sendMessage({
      conversationId: selectedConversation._id,
      receiverId: selectedConversation.sender._id,
      text: message,
    });

    setMessages((prev) => [...prev, msg]);
    // scrollToBottomWhenMessageSent();
  }

  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const scrollToBottomSmooth = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);
  useEffect(() => {
    scrollToBottomSmooth();
  }, [messages]);

  // const hasMounted = useRef(false);
  // const hasScrolledAfterLoad = useRef(false);

  // useEffect(() => {
  //   // 1️⃣ Run once on mount
  //   if (!hasMounted.current) {
  //     scrollToBottom();
  //     hasMounted.current = true;
  //     return;
  //   }

  //   // 2️⃣ Run once when messages FIRST load
  //   if (!hasScrolledAfterLoad.current && messages.length > 0) {
  //     scrollToBottom();
  //     hasScrolledAfterLoad.current = true;
  //   }
  // }, [messages]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

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
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {/* Incoming */}
            {messages.map((msg) =>
              msg.senderId !== session?.user?.id ? (
                <SenderMessage
                  key={msg._id}
                  text={msg.text}
                  createdAt={msg.createdAt}
                  user={{}}
                  setReply={() => {}}
                />
              ) : (
                <UserMessage
                  key={msg._id}
                  createdAt={msg.createdAt}
                  isRead={msg.seen}
                  text={msg.text}
                  user={{}}
                />
              ),
            )}
            <div ref={bottomRef} className="h-1 w-full" />
          </div>

          {/* Input */}
          <ChatInputForm sendMessage={handleSendMessage} />
        </div>
      )}
    </>
  );
};

export default ChatArea;
