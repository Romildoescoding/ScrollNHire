import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-handserif", // 👈 custom CSS variable
});

export const metadata: Metadata = {
  title: "ScrollnHire | Hiring and Discovery Reimagined",
  description:
    "Scroll through real people, real work, and real opportunities — all in one platform designed for hiring and getting hired.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${playfair.variable}`}>
        <TooltipProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <SessionProvider>{children}</SessionProvider>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
