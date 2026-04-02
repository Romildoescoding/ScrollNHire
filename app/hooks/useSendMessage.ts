import { useState } from "react";

export default function useSendMessage() {
  const [loading, setLoading] = useState(false);

  const sendMessage = async ({
    conversationId,
    receiverId,
    text,
  }: {
    conversationId: string;
    receiverId: string;
    text: string;
  }) => {
    try {
      setLoading(true);

      const res = await fetch("/api/messages", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          receiverId,
          text,
        }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data.data;
    } catch (err) {
      console.error("SEND_MESSAGE_ERROR:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
}
