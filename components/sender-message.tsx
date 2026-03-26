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
import { useEffect, useState } from "react";

// SET REPLY would set the id of the message to be replied to. ADDING LATER ON.
const SenderMessage = ({ user, text, setReply }) => {
  const [copied, setIsCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setIsCopied(false), 500);
    }
  }, [copied]);
  return (
    <div className="h-fit items-center w-full flex gap-2">
      <span className="h-fit w-full max-w-[60vw] min-[600px]:max-w-[55vw] min-[1000px]:max-w-[40vw] sender-message text-sm min-[600px]:text-base">
        <span>{text}</span>
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
    </div>
  );
};

export default SenderMessage;
