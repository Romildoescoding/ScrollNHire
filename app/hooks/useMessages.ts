import { useEffect, useState } from "react";

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text?: string;
  seen: boolean;
  createdAt: string;
}

export default function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    async function fetchMessages() {
      try {
        setLoading(true);

        if (!conversationId) return;

        const res = await fetch(`/api/messages/${conversationId}`, {
          credentials: "include",
        });

        const data = await res.json();
        setMessages(data.data || []);
      } catch (err) {
        console.error(err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [conversationId]);

  return { messages, setMessages, loading };
}
