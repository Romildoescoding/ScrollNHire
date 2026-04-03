import {
  ArrowLeft,
  ChevronDown,
  MoreVertical,
  PhoneMissed,
  Send,
  User2,
  Video,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState<boolean>(true);
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
    const interviewTime = getFinalDateTime();
    if (!interviewTime) return;

    // await updateInterview({
    //   interviewTime,
    //   interviewLink: link,
    // });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen} defaultOpen={true}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScheduleInterview();
          }}
        >
          {/* <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger> */}
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
                      setOpenPopover
                      onSelect={(date) => {
                        setDate(date);
                        setOpen(false);
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
              <Button type="submit">Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      {/* //////////////////////////////////////////////////////////////////////////// */}

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
          <ChatInputForm
            sendMessage={handleSendMessage}
            setOpenInterviewModal={setOpen}
          />
        </div>
      )}
    </>
  );
};

export default ChatArea;
