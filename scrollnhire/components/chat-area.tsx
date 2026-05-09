import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  MoreVertical,
  PhoneMissed,
  Send,
  User2,
  Video,
} from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import UserMessage from "./receiver-message";
import SenderMessage from "./sender-message";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";
import { IConversation } from "@/app/hooks/useConversations";
import useMessages from "@/app/hooks/useMessages";
import Image from "next/image";
import ChatInputForm from "./chat-input-form";
import useSendMessage from "@/app/hooks/useSendMessage";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import axios from "axios";
import { socket } from "@/app/_lib/socket";
import { useSeenObserver } from "@/app/hooks/useSeenObserver";
import { cn } from "@/lib/utils";

import { motion } from "motion/react";

export type MessageType = "message" | "interview";

export interface IMessage {
  _id: string;

  conversationId: string;
  senderId: string;
  receiverId: string;

  text?: string;

  type: MessageType;

  seen: boolean;

  createdAt: string;

  interviewMeta?: {
    date: string; // ISO string
    link: string;
  };
}

type Platform = "google_meet" | "zoom" | "calendly" | "teams" | "unknown";

export const detectPlatform = (link: string): Platform => {
  const url = link.toLowerCase();

  if (url.includes("meet.google.com")) return "google_meet";
  if (url.includes("zoom.")) return "zoom";
  if (url.includes("calendly.com")) return "calendly";
  if (url.includes("teams.microsoft.com")) return "teams";

  return "unknown";
};

const ChatArea = ({
  selectedConversation,
  setConversations,
  setSelectedConversation,
  onlineUsers,
}: {
  onlineUsers: string[];
  selectedConversation: IConversation | null;
  setSelectedConversation: Dispatch<SetStateAction<IConversation | null>>;
  setConversations: Dispatch<SetStateAction<IConversation[]>>;
}) => {
  const { data: session } = useSession();

  // SETTING UP THE SOCKET. ////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!session?.user?.id) return;

    if (!socket.connected) socket.connect();

    socket.emit("register", session.user.id);
  }, [session]);

  useEffect(() => {
    if (!selectedConversation?._id) return;

    if (!socket.connected) socket.connect();

    socket.emit("join_conversation", selectedConversation._id);

    return () => {
      socket.emit("leave_conversation", selectedConversation._id);
    };
  }, [selectedConversation]);

  // MESSAGE POPULATION

  useEffect(() => {
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // INTERVIEW SCHEDULING
  useEffect(() => {
    socket.on("receive_interview_update", (message) => {
      setMessages((prev) =>
        prev.some((msg) => msg._id === message._id)
          ? prev.map((msg) => (msg._id === message._id ? message : msg))
          : [...prev, message],
      );
    });

    return () => {
      socket.off("receive_interview_update");
    };
  }, []);

  // /////////////////////////////////////////////////////////////////////////

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

    setConversations((prev) => {
      const index = prev.findIndex((c) => c._id === selectedConversation._id);

      if (index === -1) return prev;

      const updated = [...prev];
      const convo = updated[index];

      const updatedConvo = {
        ...convo,
        lastMessage: {
          message: msg.text,
          createdAt: msg.createdAt,
          senderId: msg.senderId,
          isRead: false,
        },
      };

      updated.splice(index, 1);
      return [updatedConvo, ...updated]; // 🔥 move to top
    });

    // EMIT THE MESSAGE TO THE SOCKET ROOM
    socket.emit("send_message", {
      conversationId: selectedConversation._id,
      message: msg,
      receiverId: selectedConversation.sender._id, // 🔥 ADD THIS
    });

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
  const [open, setOpen] = useState<boolean>(false);
  const [openPopover, setOpenPopover] = useState(false);

  const [interviewLink, setInterviewLink] = useState("");
  const [time, setTime] = useState("10:30");
  const [date, setDate] = React.useState<Date>();

  const getFinalDateTime = () => {
    if (!date || !time) return null;

    const [hours, minutes] = time.split(":").map(Number);

    const finalDate = new Date(date);
    finalDate.setHours(hours);
    finalDate.setMinutes(minutes);

    return finalDate;
  };

  const handleScheduleInterview = async () => {
    if (!selectedConversation || !interviewLink) return;
    const interviewTime = getFinalDateTime();
    if (!interviewTime) return;
    try {
      const res = await axios.post("/api/interview", {
        interviewTime,
        interviewLink,
        conversationId: selectedConversation._id,
        receiverId: selectedConversation.sender._id,
      });

      const message = res.data?.data;
      setMessages((prev) => [...prev, message]);

      socket.emit("interview_updated", {
        conversationId: selectedConversation._id,
        message,
        receiverId: selectedConversation.sender._id,
      });
      setOpen(false);

      // example:
      // router.push(`/chat/${convo._id}`);
    } catch (err) {
      console.error("Error scheduling interview:", err);
    }

    // await updateInterview({
    //   interviewTime,
    //   interviewLink: link,
    // });
  };

  const [messageId, setMessageId] = useState("");
  const [openEditInterview, setOpenEditInterview] = useState(false);

  function handleOpenEditModal(interviewMeta) {
    if (!interviewMeta) return;
    setMessageId(interviewMeta.messageId);

    const dateObj = new Date(interviewMeta.date);

    setDate(dateObj);

    // ⏱️ extract time in HH:mm format
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");

    setTime(`${hours}:${minutes}`);

    setInterviewLink(interviewMeta.link || "");

    setOpenEditInterview(true);
  }

  async function handleEditInterview() {
    if (!selectedConversation || !interviewLink) return;
    const interviewTime = getFinalDateTime();
    if (!interviewTime) return;
    try {
      // interviewTime, interviewLink, conversationId, messageId
      const res = await axios.patch("/api/interview", {
        messageId,
        interviewTime,
        interviewLink,
        conversationId: selectedConversation._id,
        // receiverId: selectedConversation.sender._id,
      });

      const message = res.data?.data;
      setMessages((prev) =>
        prev.map((msg) => (msg._id === message._id ? message : msg)),
      );

      socket.emit("interview_updated", {
        conversationId: selectedConversation._id,
        message,
        receiverId: selectedConversation.sender._id,
      });
      setOpenEditInterview(false);

      // example:
      // router.push(`/chat/${convo._id}`);
    } catch (err) {
      console.error("Error editing interview:", err);
    }
  }

  const [openInterview, setOpenInterview] = useState(false);

  function handleOpenInterview(msg: IMessage) {
    // TO be able to edit after clicking edit interview for the employer
    setMessageId(msg._id);
    if (!msg.interviewMeta) return;
    const dateObj = new Date(msg.interviewMeta.date);

    setDate(dateObj);

    // ⏱️ extract time in HH:mm format
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");

    setTime(`${hours}:${minutes}`);

    setInterviewLink(msg.interviewMeta.link || "");
    setOpenInterview(true);
  }

  const [copied, setIsCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setIsCopied(false), 500);
    }
  }, [copied]);

  async function handleSeenMessages(messageIds: string[]) {
    // 🔥 1. Update UI instantly
    setMessages((prev) =>
      prev.map((msg) =>
        messageIds.includes(msg._id) ? { ...msg, seen: true } : msg,
      ),
    );

    if (!selectedConversation) return;

    // 🔥 2. Update conversation sidebar
    setConversations((prev) =>
      prev.map((convo) => {
        if (convo._id !== selectedConversation._id) return convo;

        return {
          ...convo,
          unreadMessagesCount: 0,
          lastMessage: {
            ...convo.lastMessage!,
            isRead: true,
          },
        };
      }),
    );

    // 🔥 3. API call
    await axios.patch("/api/messages/seen", {
      messageIds,
      conversationId: selectedConversation._id,
    });

    // 🔥 4. socket emit
    socket.emit("messages_seen", {
      conversationId: selectedConversation._id,
      messageIds,
      senderId: selectedConversation.sender._id,
    });
  }

  const { observe } = useSeenObserver({
    messages,
    currentUserId: session?.user.id,
    conversationId: selectedConversation?._id,
    onSeen: handleSeenMessages,
  });

  useEffect(() => {
    socket.on("messages_seen_update", ({ messageIds }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg._id) ? { ...msg, seen: true } : msg,
        ),
      );

      // 🔥 update sidebar
      setConversations((prev) =>
        prev.map((convo) => {
          if (convo._id !== selectedConversation?._id) return convo;

          return {
            ...convo,
            lastMessage: {
              ...convo.lastMessage!,
              isRead: true,
            },
          };
        }),
      );
    });

    return () => socket.off("messages_seen_update");
  }, [selectedConversation]);

  return (
    <>
      {/* SCHEDULE INTERVIEW MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
              <DialogDescription>
                Please generate a meeting link using any application
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <div className="w-full items-center justify-center flex gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open("https://meet.google.com/landing", "_blank")
                      }
                      className="flex items-center h-12 w-12 justify-center border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="google-meet"
                        src={"/Google_Meet_icon.svg"}
                        className="w-6 h-6"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Google Meet</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          "https://zoom.us/start/videomeeting",
                          "_blank",
                        )
                      }
                      className="flex items-center h-12 w-12 justify-center border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={80}
                        width={80}
                        alt="zoom"
                        src={"/Zoom_icon.svg"}
                        className="aspect-auto w-10"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zoom</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open("https://calendly.com/", "_blank")
                      }
                      className="flex items-center h-12 w-12 justify-center border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="calendly"
                        src={"/Calendly_icon.png"}
                        className="w-8 h-8"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Calendly</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open("https://teams.microsoft.com", "_blank")
                      }
                      className="flex items-center h-12 w-12 justify-center border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="teams"
                        src={"/Teams_icon.png"}
                        className="w-6 h-6"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Microsoft Teams</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Field>
                <Label htmlFor="link-1">Meeting Link</Label>
                <div className="flex item-center justify-start gap-2">
                  {detectPlatform(interviewLink) === "google_meet" && (
                    <div
                      className="flex items-center h-9 w-9 justify-center"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="teams"
                        src={"/Google_Meet_icon.svg"}
                        className="w-6 h-6"
                      />
                    </div>
                  )}
                  {detectPlatform(interviewLink) === "calendly" && (
                    <div
                      className="flex items-center h-19 w-9 justify-center"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="teams"
                        src={"/Calendly_icon.png"}
                        className="w-8 h-8"
                      />
                    </div>
                  )}
                  {detectPlatform(interviewLink) === "teams" && (
                    <div
                      className="flex items-center h-9 w-9 justify-center"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="teams"
                        src={"/Teams_icon.png"}
                        className="w-6 h-6"
                      />
                    </div>
                  )}
                  {detectPlatform(interviewLink) === "zoom" && (
                    <div
                      className="flex items-center h-9 w-9 justify-center"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="teams"
                        src={"/Zoom_icon.svg"}
                        className="w-9 aspect-auto"
                      />
                    </div>
                  )}
                  <Input
                    className="flex-1"
                    id="link-1"
                    name="link"
                    value={interviewLink}
                    onChange={(e) => setInterviewLink(e.target.value)}
                    placeholder="Paste the meeting link"
                  />
                </div>
              </Field>
            </FieldGroup>
            <FieldGroup className="mb-2 mr-auto max-w-xs flex-row">
              <Field>
                <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
                <Popover open={openPopover} onOpenChange={setOpenPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker-optional"
                      className="w-32 justify-between font-normal"
                    >
                      {date ? format(date, "PPP") : "Select date"}
                      <ChevronDown data-icon="inline-end" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      defaultMonth={date}
                      onSelect={(date) => {
                        setDate(date);
                        setOpenPopover(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
              <Field className="w-32">
                <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  id="time-picker-optional"
                  // step="1" // to make this in seconds
                  className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleScheduleInterview} type="submit">
                Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {/* EDIT INTERVIEW MODAL */}
      <Dialog open={openEditInterview} onOpenChange={setOpenEditInterview}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditInterview();
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Interview</DialogTitle>
              <DialogDescription>
                Please generate a meeting link using any application
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <div className="w-full items-center justify-center flex gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open("https://meet.google.com/landing", "_blank")
                      }
                      className="flex items-center h-12 w-12 justify-center border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="google-meet"
                        src={"/Google_Meet_icon.svg"}
                        className="w-6 h-6"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Google Meet</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          "https://zoom.us/start/videomeeting",
                          "_blank",
                        )
                      }
                      className="flex items-center h-12 w-12 justify-center border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={80}
                        width={80}
                        alt="zoom"
                        src={"/Zoom_icon.svg"}
                        className="aspect-auto w-10"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zoom</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open("https://calendly.com/", "_blank")
                      }
                      className="flex items-center h-12 w-12 justify-center border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="calendly"
                        src={"/Calendly_icon.png"}
                        className="w-8 h-8"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Calendly</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open("https://teams.microsoft.com", "_blank")
                      }
                      className="flex items-center h-12 w-12 justify-center border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="teams"
                        src={"/Teams_icon.png"}
                        className="w-6 h-6"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Microsoft Teams</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Field>
                <Label htmlFor="link-1">Meeting Link</Label>
                <div className="flex item-center justify-start gap-2">
                  {detectPlatform(interviewLink) === "google_meet" && (
                    <div
                      className="flex items-center h-9 w-9 justify-center"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="teams"
                        src={"/Google_Meet_icon.svg"}
                        className="w-6 h-6"
                      />
                    </div>
                  )}
                  {detectPlatform(interviewLink) === "calendly" && (
                    <div
                      className="flex items-center h-19 w-9 justify-center"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="teams"
                        src={"/Calendly_icon.png"}
                        className="w-8 h-8"
                      />
                    </div>
                  )}
                  {detectPlatform(interviewLink) === "teams" && (
                    <div
                      className="flex items-center h-9 w-9 justify-center"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="teams"
                        src={"/Teams_icon.png"}
                        className="w-6 h-6"
                      />
                    </div>
                  )}
                  {detectPlatform(interviewLink) === "zoom" && (
                    <div
                      className="flex items-center h-9 w-9 justify-center"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="teams"
                        src={"/Zoom_icon.svg"}
                        className="w-9 aspect-auto"
                      />
                    </div>
                  )}
                  <Input
                    className="flex-1"
                    id="link-1"
                    name="link"
                    value={interviewLink}
                    onChange={(e) => setInterviewLink(e.target.value)}
                    placeholder="Paste the meeting link"
                  />
                </div>
              </Field>
            </FieldGroup>
            <FieldGroup className="mb-2 mr-auto max-w-xs flex-row">
              <Field>
                <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
                <Popover open={openPopover} onOpenChange={setOpenPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker-optional"
                      className="w-32 justify-between font-normal"
                    >
                      {date ? format(date, "PPP") : "Select date"}
                      <ChevronDown data-icon="inline-end" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      defaultMonth={date}
                      onSelect={(date) => {
                        setDate(date);
                        setOpenPopover(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
              <Field className="w-32">
                <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  id="time-picker-optional"
                  // step="1" // to make this in seconds
                  className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleEditInterview} type="submit">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {/* VIEW INTERVIEW MODAL */}
      <Dialog open={openInterview} onOpenChange={setOpenInterview}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Interview Details</DialogTitle>
              <DialogDescription>
                Please join the interview using the meeting link
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              {/* <div className="w-full items-center justify-center flex gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open("https://meet.google.com/landing", "_blank")
                      }
                      className="flex items-center h-12 w-12 justify-center border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="google-meet"
                        src={"/Google_Meet_icon.svg"}
                        className="w-6 h-6"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Google Meet</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          "https://zoom.us/start/videomeeting",
                          "_blank",
                        )
                      }
                      className="flex items-center h-12 w-12 justify-center border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={80}
                        width={80}
                        alt="zoom"
                        src={"/Zoom_icon.svg"}
                        className="aspect-auto w-10"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zoom</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open("https://calendly.com/", "_blank")
                      }
                      className="flex items-center h-12 w-12 justify-center border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="calendly"
                        src={"/Calendly_icon.png"}
                        className="w-8 h-8"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Calendly</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open("https://teams.microsoft.com", "_blank")
                      }
                      className="flex items-center h-12 w-12 justify-center border rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="teams"
                        src={"/Teams_icon.png"}
                        className="w-6 h-6"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Microsoft Teams</p>
                  </TooltipContent>
                </Tooltip>
              </div> */}
              <Field>
                <Label htmlFor="link-1">Meeting Link</Label>
                <div className="flex item-center justify-start gap-2">
                  {detectPlatform(interviewLink) === "google_meet" && (
                    <div
                      className="flex items-center h-9 w-9 justify-center"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="teams"
                        src={"/Google_Meet_icon.svg"}
                        className="w-6 h-6"
                      />
                    </div>
                  )}
                  {detectPlatform(interviewLink) === "calendly" && (
                    <div
                      className="flex items-center h-19 w-9 justify-center"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="teams"
                        src={"/Calendly_icon.png"}
                        className="w-8 h-8"
                      />
                    </div>
                  )}
                  {detectPlatform(interviewLink) === "teams" && (
                    <div
                      className="flex items-center h-9 w-9 justify-center"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="teams"
                        src={"/Teams_icon.png"}
                        className="w-6 h-6"
                      />
                    </div>
                  )}
                  {detectPlatform(interviewLink) === "zoom" && (
                    <div
                      className="flex items-center h-9 w-9 justify-center"
                      style={{ padding: 0 }}
                    >
                      <Image
                        height={40}
                        width={40}
                        alt="teams"
                        src={"/Zoom_icon.svg"}
                        className="w-9 aspect-auto"
                      />
                    </div>
                  )}
                  <Input
                    className="flex-1"
                    id="link-1"
                    name="link"
                    value={interviewLink}
                    // onChange={()=> setInterviewLink(interviewLink)}
                    disabled={true}
                    placeholder="Meeting link"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(interviewLink || "");
                      setIsCopied(true);
                    }}
                    className="h-9 w-9 flex items-center justify-center"
                    variant="ghost"
                  >
                    {copied ? <Check size={15} /> : <Copy />}
                  </Button>
                </div>
              </Field>
            </FieldGroup>
            <FieldGroup className="mb-2 mr-auto max-w-xs flex-row">
              <Field>
                <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
                <Button
                  disabled={true}
                  variant="outline"
                  id="date-picker-optional"
                  className="w-32 justify-between font-normal"
                >
                  {date ? format(date, "PPP") : "Interview Date"}
                  {/* <ChevronDown data-icon="inline-end" /> */}
                </Button>
              </Field>
              <Field className="w-32">
                <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
                <Input
                  type="time"
                  value={time}
                  disabled={true}
                  // onChange={() => setTime(time)}
                  id="time-picker-optional"
                  // step="1" // to make this in seconds
                  className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              {session?.user?.role === "employer" && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setOpenEditInterview(true);
                    setOpenInterview(false);
                  }}
                >
                  Edit Interview
                </Button>
              )}
              <Button onClick={() => window.open(interviewLink, "_blank")}>
                Join Interview
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {/* //////////////////////////////////////////////////////////////////////////// */}

      {!selectedConversation && (
        <div className=" hidden min-[550px]:flex flex-1 items-center justify-center bg-background dark:bg-[#0f0f12]">
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
      {/* desktop view chats sheet */}
      {selectedConversation && (
        <div className="flex-1 max-[549px]:w-full hidden min-[550px]:flex flex-col">
          <div className="flex justify-between items-center gap-4 px-4 py-3">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Back Button (mobile only) */}
              {/* <Button
                style={{ padding: 0 }}
                variant="outline"
                className="flex w-8 h-8 lg:hidden items-center justify-center "
              >
                <ArrowLeft className="w-5 h-5" />
              </Button> */}

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
                <span
                  className={cn(
                    "absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900",
                    onlineUsers.includes(selectedConversation?.sender._id)
                      ? "bg-green-500"
                      : "bg-zinc-500",
                  )}
                />
              </div>

              {/* Name + Status */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {selectedConversation?.sender.name}
                </span>
                {/* <span className="text-xs text-green-500">{selectedConversation?.sender.status}</span> */}
                <span
                  className={cn(
                    "text-xs",
                    onlineUsers.includes(selectedConversation?.sender._id)
                      ? "text-green-500"
                      : "text-zinc-400",
                  )}
                >
                  {onlineUsers.includes(selectedConversation?.sender._id)
                    ? "Online"
                    : "Offline"}
                </span>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Desktop Actions */}
              {/* <div className="hidden lg:flex items-center gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-md border bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700">
                  <Video className="w-4 h-4" />
                </button>

                <button className="w-9 h-9 flex items-center justify-center rounded-md border bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700">
                  <PhoneMissed className="w-4 h-4" />
                </button>
              </div> */}

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
            {messagesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full flex items-center h-[42px] mb-2"
                    style={{ justifyContent: i % 2 == 0 ? "start" : "end" }}
                  >
                    <div className="shimmer2 rounded-lg w-3/4 h-full"></div>
                  </div>
                ))
              : messages.map((msg) =>
                  msg.senderId !== session?.user?.id ? (
                    <SenderMessage
                      key={msg._id}
                      msg={msg}
                      observe={observe}
                      handleOpenInterview={handleOpenInterview}
                      // text={msg.text}
                      // createdAt={msg.createdAt}
                      // user={{}}
                      // setReply={() => {}}
                    />
                  ) : (
                    <UserMessage
                      key={msg._id}
                      msg={msg}
                      handleOpenInterview={handleOpenInterview}
                      role={session.user?.role || ""}
                      handleOpenEditInterview={handleOpenEditModal}
                      // createdAt={msg.createdAt}
                      // isRead={msg.seen}
                      // text={msg.text}
                      // user={{}}
                    />
                  ),
                )}
            <div ref={bottomRef} className="h-1 w-full" />
          </div>

          {/* Input */}
          <ChatInputForm
            selectedConversation={selectedConversation}
            sendMessage={handleSendMessage}
            setOpenInterviewModal={(bool) => {
              setInterviewLink("");
              setDate(undefined);
              setTime("");
              setOpen(bool);
            }}
          />
        </div>
      )}

      <motion.div
        style={{ right: selectedConversation ? 0 : "-100vw" }}
        className="bg-white dark:bg-zinc-950 absolute top-0 h-full w-screen transition-all flex min-[550px]:hidden flex-col"
      >
        <div className="flex justify-between items-center gap-4 px-4 py-3">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Back Button (mobile only) */}
            <Button
              style={{ padding: 0 }}
              variant="outline"
              className="flex w-8 h-8 lg:hidden items-center justify-center "
              onClick={() => setSelectedConversation(null)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

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
              <span className="text-xs min-[500px]:text-sm font-semibold">
                {selectedConversation?.sender.name}
              </span>
              {/* <span className="text-xs text-green-500">{selectedConversation?.sender.status}</span> */}
              <span className="text-[10px] min-[500px]:text-xs text-green-500">
                Online
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Desktop Actions */}
            {/* <div className="hidden lg:flex items-center gap-2">
              <button className="w-9 h-9 flex items-center justify-center rounded-md border bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700">
                <Video className="w-4 h-4" />
              </button>

              <button className="w-9 h-9 flex items-center justify-center rounded-md border bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700">
                <PhoneMissed className="w-4 h-4" />
              </button>
            </div> */}

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
                msg={msg}
                observe={observe}
                handleOpenInterview={handleOpenInterview}
                // text={msg.text}
                // createdAt={msg.createdAt}
                // user={{}}
                // setReply={() => {}}
              />
            ) : (
              <UserMessage
                key={msg._id}
                msg={msg}
                handleOpenInterview={handleOpenInterview}
                role={session.user?.role || ""}
                handleOpenEditInterview={handleOpenEditModal}
                // createdAt={msg.createdAt}
                // isRead={msg.seen}
                // text={msg.text}
                // user={{}}
              />
            ),
          )}
          <div ref={bottomRef} className="h-1 w-full" />
        </div>

        {/* Input */}
        <ChatInputForm
          selectedConversation={selectedConversation}
          sendMessage={handleSendMessage}
          setOpenInterviewModal={(bool) => {
            setInterviewLink("");
            setDate(undefined);
            setTime("");
            setOpen(bool);
          }}
        />
      </motion.div>
    </>
  );
};

export default ChatArea;
