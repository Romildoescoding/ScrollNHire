import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  CheckCheck,
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
import { formatDate } from "@/app/lib/utils";
import { IMessage } from "./chat-area";
import { formatInterviewDate } from "@/app/_lib/actions";

const UserMessage = ({
  msg,
  role,
  handleOpenEditInterview,
  handleOpenInterview,
}: {
  msg: IMessage;
  role: string;
  handleOpenEditInterview: (interviewMeta: Record<string, string>) => void;
  handleOpenInterview: (msg: IMessage) => void;
}) => {
  // const UserMessage = ({ user, text, createdAt, isRead }) => {
  // console.log(user);
  const [copied, setIsCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setIsCopied(false), 500);
    }
  }, [copied]);
  return (
    <>
      {msg.type === "interview" && msg.interviewMeta ? (
        <div className="h-fit items-center justify-end w-full flex gap-2 relative mb-10">
          <span className="absolute -bottom-6 right-0 flex gap-2 items-center text-xs text-accent-foreground">
            <span>{formatDate(msg.createdAt)}</span>{" "}
            {msg.seen ? (
              <CheckCheck className="text-cyan-500" size={16} />
            ) : (
              <Check className="text-foreground/40" size={16} />
            )}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-[20px] w-[20px] p-1 rounded-sm"
                style={{ marginLeft: "auto" }}
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                {role === "employer" && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleOpenEditInterview({
                        messageId: msg._id,
                        ...msg.interviewMeta,
                      })
                    }
                  >
                    Edit
                    <DropdownMenuShortcut>
                      <Pencil />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                )}
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

          <span
            onClick={() => handleOpenInterview(msg)}
            className=" cursor-pointer h-fit w-full max-w-[60vw] min-[600px]:max-w-[55vw] min-[1000px]:max-w-[40vw] user-message text-sm min-[600px]:text-base bg-zinc-800 border-none text-white"
          >
            <div className="bg-zinc-700  mb-1 rounded-md flex gap-2 p-2 items-center">
              <CalendarDays />
              <span className="text-sm">
                {formatInterviewDate(msg.interviewMeta.date)}
              </span>
              {/* {msg.interviewMeta.link} */}
            </div>
            <span>Interview Scheduled</span>
          </span>
        </div>
      ) : (
        <div className="h-fit items-center justify-end w-full flex gap-2 relative mb-10">
          <span className="absolute -bottom-6 right-0 flex gap-2 items-center text-xs text-accent-foreground">
            <span>{formatDate(msg.createdAt)}</span>{" "}
            {msg.seen ? (
              <CheckCheck className="text-cyan-500" size={16} />
            ) : (
              <Check className="text-foreground/40" size={16} />
            )}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-[20px] w-[20px] p-1 rounded-sm"
                style={{ marginLeft: "auto" }}
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

          <span className="h-fit w-full max-w-[60vw] min-[600px]:max-w-[55vw] min-[1000px]:max-w-[40vw] user-message text-sm min-[600px]:text-base bg-zinc-800 border-none text-white">
            {msg.text}
          </span>
        </div>
      )}
    </>
  );
};

export default UserMessage;
