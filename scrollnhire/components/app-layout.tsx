import React, { ReactNode } from "react";
import Navbar from "./navbar";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    // fixed alignment like dudeee...
    // <div className=" ml-2 w-[calc(100%-0.5rem)] h-full flex justify-center relative rounded-t-lg">
    <div className="w-full h-full flex justify-center relative rounded-t-lg">
      <Navbar />
      {/* <main className="max-w-[1440px] h-[calc(100vh-16px)] w-full pt-18 overflow-auto"> */}
      <main className="max-w-[1440px] h-svh md:h-[calc(100vh-16px)] w-full pt-14 md:pt-18 overflow-auto">
        {/* <main className="max-w-[1440px] h-[calc(100vh-16px)] w-full pt-18 p-6 overflow-auto"> */}
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
