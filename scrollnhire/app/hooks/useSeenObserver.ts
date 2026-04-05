import { useEffect, useRef } from "react";

export const useSeenObserver = ({
  messages,
  currentUserId,
  conversationId,
  onSeen,
}: {
  messages: any[];
  currentUserId: string;
  conversationId: string;
  onSeen: (messageIds: string[]) => void;
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const seenSet = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!currentUserId || !conversationId) return; // 🛑 guard
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newlySeen: string[] = [];

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute("data-id");
            const senderId = entry.target.getAttribute("data-sender");

            if (
              messageId &&
              senderId !== currentUserId &&
              !seenSet.current.has(messageId)
            ) {
              seenSet.current.add(messageId);
              newlySeen.push(messageId);
            }
          }
        });

        if (newlySeen.length > 0) {
          onSeen(newlySeen);
        }
      },
      { threshold: 0.6 }, // 👁️ 60% visible = seen
    );

    return () => observerRef.current?.disconnect();
  }, [conversationId, currentUserId]);

  const observe = (el: HTMLElement | null) => {
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  };

  return { observe };
};
