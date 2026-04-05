import {
  Calendar,
  CalendarDays,
  Check,
  Copy,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Reply,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect, useState } from "react";
import { formatDate } from "@/app/lib/utils";
import { IMessage } from "./chat-area";
import { formatInterviewDate } from "@/app/_lib/actions";

// SET REPLY would set the id of the message to be replied to. ADDING LATER ON.
const SenderMessage = ({
  msg,
  handleOpenInterview,
  observe,
}: {
  msg: IMessage;
  handleOpenInterview: (msg: IMessage) => void;
  observe: (el: HTMLElement | null) => void;
}) => {
  const [copied, setIsCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setIsCopied(false), 500);
    }
  }, [copied]);
  return (
    <>
      {msg.type === "interview" && msg.interviewMeta ? (
        <div
          ref={observe} // 👈 THIS is the important part
          data-id={msg._id}
          data-sender={msg.senderId}
          className="h-fit items-center w-full flex gap-2 relative mb-10"
        >
          <span className="absolute -bottom-6 left-0 flex gap-2 items-center text-xs text-accent-foreground">
            {formatDate(msg.createdAt)}
          </span>
          <span
            onClick={() => handleOpenInterview(msg)}
            className=" cursor-pointer h-fit w-full max-w-[60vw] min-[600px]:max-w-[55vw] min-[1000px]:max-w-[40vw] sender-message text-sm min-[600px]:text-base"
          >
            <div className="bg-zinc-200 dark:bg-zinc-300 mb-1 rounded-md flex gap-2 p-2 items-center">
              <CalendarDays />
              <span className="text-sm">
                {formatInterviewDate(msg.interviewMeta.date)}
              </span>
              {/* {msg.interviewMeta.link} */}
            </div>
            <span>Interview Scheduled</span>
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-[20px] w-[20px] p-1 rounded-sm"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(msg.text || "");
                    setIsCopied(true);
                  }}
                >
                  {copied ? "Copied" : "Copy"}
                  <DropdownMenuShortcut>
                    {copied ? <Check size={15} /> : <Copy />}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem
                // onClick={() => {
                //   navigator.clipboard.writeText(text);
                //   setIsCopied(true);
                // }}
                >
                  Reply
                  <DropdownMenuShortcut>
                    <Reply />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div
          ref={observe} // 👈 THIS is the important part
          data-id={msg._id}
          data-sender={msg.senderId}
          className="h-fit items-center w-full flex gap-2 relative mb-10"
        >
          <span className="absolute -bottom-6 left-0 flex gap-2 items-center text-xs text-accent-foreground">
            {formatDate(msg.createdAt)}
          </span>
          <span className="h-fit w-full max-w-[60vw] min-[600px]:max-w-[55vw] min-[1000px]:max-w-[40vw] sender-message text-sm min-[600px]:text-base">
            <span>{msg.text}</span>
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-[20px] w-[20px] p-1 rounded-sm"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(msg.text || "");
                    setIsCopied(true);
                  }}
                >
                  {copied ? "Copied" : "Copy"}
                  <DropdownMenuShortcut>
                    {copied ? <Check size={15} /> : <Copy />}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                // onClick={() => {
                //   navigator.clipboard.writeText(text);
                //   setIsCopied(true);
                // }}
                >
                  Reply
                  <DropdownMenuShortcut>
                    <Reply />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
};

export default SenderMessage;
