import { useEffect, useState } from "react";

export default function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    async function fetchMessages() {
      try {
        setLoading(true);

        if (!conversationId) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/messages/${conversationId}`,
          { credentials: "include" },
        );

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
