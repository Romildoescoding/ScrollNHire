import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Check, Copy, MoreHorizontal, MoreVertical, Reply } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const UserMessage = ({ user, text }) => {
  // console.log(user);
  const [copied, setIsCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setIsCopied(false), 500);
    }
  }, [copied]);
  return (
    <div className="h-fit items-center justify-end w-full flex gap-2">
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

      <span className="h-fit w-full max-w-[60vw] min-[600px]:max-w-[55vw] min-[1000px]:max-w-[40vw] user-message text-sm min-[600px]:text-base bg-cyan-600 border-cyan-600 text-white">
        {text}
      </span>
    </div>
  );
};

export default UserMessage;
