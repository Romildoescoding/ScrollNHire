import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function DashboardShowcase() {
  return (
    <section className="h-[150vh] min-h-fit dark:bg-white bg-black text-white dark:text-black flex flex-col gap-12 pt-[25vh] px-8 pb-8">
      <div className="flex justify-between w-full h-fit items-end">
        <div className="flex flex-col text-6xl font-semibold">
          <h2 className="">Your hiring</h2>
          <h2 className="">command center</h2>
        </div>
        <div className="w-fit h-fit flex flex-col items-end">
          <p className="text-muted-foreground">
            Everything you need to hire, all in one place.
          </p>
          <Link
            href="/"
            className="group h-fit inline-flex items-center bg-transparent transition-all duration-300 w-[100px]"
          >
            Start Now
            <ChevronRight className="h-4 w-4 ml-0 transition-all duration-300 group-hover:ml-2" />
          </Link>
        </div>
      </div>

      <div className="w-full aspect-video bg-blue-600 rounded-2xl flex items-center justify-center text-2xl">
        DASHBOARD VIDEO
      </div>
    </section>
  );
}
