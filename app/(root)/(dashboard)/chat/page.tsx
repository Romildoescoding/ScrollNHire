"use client";
import React from "react";
import { Send } from "lucide-react";

const chats = [
  {
    name: "Jacquenetta",
    message: "Great! Looking forward to it.",
    time: "10m",
    unread: 3,
  },
  {
    name: "Nickola",
    message: "Sounds perfect!",
    time: "40m",
    unread: 0,
  },
  {
    name: "Farand",
    message: "How about 7 PM?",
    time: "Yesterday",
    unread: 1,
  },
];

const AiChatPage = () => {
  return (
    <div className="h-screen flex bg-gray-100 dark:bg-zinc-900 text-black dark:text-white">
      {/* Sidebar */}
      <div className="w-full max-w-sm border-r border-gray-200 dark:border-zinc-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chats</h2>
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800">
            +
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none"
          />
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat, i) => (
            <div
              key={i}
              className="px-4 py-3 flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-zinc-800 cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white">
                {chat.name[0]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-sm">
                  <span className="font-medium truncate">{chat.name}</span>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.message}</p>
              </div>

              {/* Unread */}
              {chat.unread > 0 && (
                <div className="w-5 h-5 text-xs flex items-center justify-center bg-green-500 text-white rounded-full">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Incoming */}
          <div className="max-w-md bg-gray-200 dark:bg-zinc-800 p-3 rounded-lg">
            Hey! How’s it going?
          </div>

          {/* Outgoing */}
          <div className="max-w-md ml-auto bg-blue-500 text-white p-3 rounded-lg">
            All good bro, working on the chat UI 😤
          </div>
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
    </div>
  );
};

export default AiChatPage;
