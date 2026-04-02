import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Check,
  CheckCheck,
  Copy,
  MoreHorizontal,
  MoreVertical,
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

const UserMessage = ({ user, text, createdAt, isRead }) => {
  // console.log(user);
  const [copied, setIsCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setIsCopied(false), 500);
    }
  }, [copied]);
  return (
    <div className="h-fit items-center justify-end w-full flex gap-2 relative mb-10">
      <span className="absolute -bottom-6 right-0 flex gap-2 items-center text-xs text-accent-foreground">
        <span>{formatDate(createdAt)}</span>{" "}
        {isRead ? (
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
                navigator.clipboard.writeText(text);
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
        {text}
      </span>
    </div>
  );
};

export default UserMessage;
