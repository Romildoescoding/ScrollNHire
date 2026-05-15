"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className=" bg-white dark:bg-black h-screen pt-44 lg:pt-[216px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0 max-w-screen overflow-x-hidden overflow-y-auto">
      <div className="w-full flex flex-col justify-center items-center gap-3 sm:gap-4">
        <div className="self-stretch w-full rounded-[3px] flex flex-col justify-center items-center gap-2">
          <div className=" w-full font-sans max-w-fit text-center hidden min-[334px]:flex justify-center flex-col text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[80px] font-medium lg:leading-24 px-2 sm:px-4 md:px-0">
            <span className="leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-[50px]">
              {`Uh Oh!`}
            </span>
            <h1 className="font-playfair text-slate-900 dark:text-slate-100 italic leading-tight mb-2">
              {`Something went wrong.`}
            </h1>
          </div>
          <div className=" w-full font-sans max-w-fit text-center min-[334px]:hidden flex justify-center flex-col text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[80px] font-medium lg:leading-24 px-2 sm:px-4 md:px-0">
            <h1 className="font-playfair text-slate-900 dark:text-slate-100 italic leading-tight mb-2">
              {`Uh Oh!`}
            </h1>
            <span className="leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-[50px]">
              {`Something went wrong.`}
            </span>
          </div>
          <div className=" w-full max-w-fit text-center text-muted-foreground flex justify-center flex-col sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
            Our servers might be busy, or
            <br className="block" />
            an unexpected issue occurred.
          </div>
        </div>
      </div>

      <div className="w-full max-w-[497px] lg:w-[497px] flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative mt-6">
        <div className="h-fit px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-[6px] relative rounded-full flex gap-4 justify-center items-center">
          <Button
            variant="default"
            className="z-5 rounded-full text-base sm:text-lg md:text-xl px-5 py-2 sm:px-10 sm:py-5 md:px-10 md:py-7 font-medium"
            onClick={() => router.back()}
          >
            Back to the page
          </Button>
        </div>
      </div>
    </div>
  );
}
