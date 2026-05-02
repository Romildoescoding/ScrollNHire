"use client";

import Link from "next/link";

export const AnimatedUnderline = ({
  text = "Hover",
  link = "/",
}: {
  text: string;
  link: string;
}) => {
  return (
    <div
      // href={link}
      className="text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer relative after:absolute after:bg-foreground after:bottom-0 after:left-0 after:h-[0.5px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300"
    >
      <Link href={link} className=" text-sm">
        {text}
      </Link>
    </div>
  );
};
