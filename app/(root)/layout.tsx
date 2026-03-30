// import Navbar from "@/components/navbar";
import React from "react";
import { ReelUploadProvider } from "../context/ReelUploadContext";
import { SidebarProvider } from "../context/SidebarContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <ReelUploadProvider>
        {/* <Navbar /> */}
        <main>{children}</main>
      </ReelUploadProvider>
    </SidebarProvider>
  );
};

export default Layout;
