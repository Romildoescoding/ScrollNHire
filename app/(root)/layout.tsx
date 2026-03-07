import Navbar from "@/components/navbar";
import React from "react";
import { ReelUploadProvider } from "../context/ReelUploadContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReelUploadProvider>
      <Navbar />
      <main>{children}</main>
    </ReelUploadProvider>
  );
};

export default Layout;
