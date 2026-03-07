import React, { ReactNode } from "react";
import Navbar from "./navbar";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-full flex justify-center relative">
      <Navbar />
      <main className="max-w-[1440px] h-screen w-full pt-18 p-6">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
