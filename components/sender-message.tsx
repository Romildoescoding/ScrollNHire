import { Check, Copy } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { TextShimmerWave } from "./ui/text-shimmer-wave";

const SenderMessage = ({ user, text }) => {
  const [copied, setIsCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setIsCopied(false), 2000);
    }
  }, [copied]);

  return (
    <div className="h-fit items-end w-full flex gap-3">
      <div className="w-[24px] h-[24px] flex items-center justify-center rounded-full border-2">
        <Image
          src={user?.image}
          height={24}
          width={24}
          alt="user-image"
          className="rounded-full border-2"
        />
      </div>
      {text.length > 0 ? (
        <span className="h-fit w-full max-w-[60vw] min-[600px]:max-w-[55vw] min-[1000px]:max-w-[40vw] user-message text-sm min-[600px]:text-base">
          <span>{text}</span>

          {copied ? (
            <span className="absolute bottom-2 right-2 p-1 transition-all rounded-md text-zinc-900">
              <Check size={15} />
            </span>
          ) : (
            <span
              role="button"
              onClick={() => {
                navigator.clipboard.writeText(text);
                setIsCopied(true);
              }}
              className="tooltip-hover absolute cursor-pointer bottom-2 right-2 p-1 transition-all rounded-md text-zinc-900 hover:bg-zinc-200"
            >
              <span className="relative overflow-visible tooltip">
                <span
                  className="tooltiptext"
                  style={{
                    top: "25px",
                    right: "-12px",
                    left: "unset",
                    display: "flex",
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                >
                  Copy
                </span>
              </span>
              <Copy size={15} />
            </span>
          )}
        </span>
      ) : (
        <TextShimmerWave className="font-mono text-sm" duration={1}>
          Typing...
        </TextShimmerWave>
      )}
    </div>
  );
};

export default SenderMessage;
