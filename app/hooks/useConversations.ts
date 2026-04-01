import { useCallback, useEffect, useState } from "react";

export interface IUser {
  _id: string;
  name: string;
  image?: string;
}

export interface ILastMessage {
  message: string;
  senderId: string;
  isRead: boolean;
  createdAt: string; // comes as ISO string from backend
}

export interface IConversation {
  _id: string;
  sender: IUser;
  lastMessage: ILastMessage | null;
  unreadMessagesCount: number;
}

export default function useConversations() {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/conversations`, {
        credentials: "include",
      });

      const data: {
        success: boolean;
        data: IConversation[];
      } = await res.json();

      setConversations(data.data || []);
    } catch (err) {
      console.error(err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    refetch: fetchConversations,
    setConversations,
    loading,
  };
}
