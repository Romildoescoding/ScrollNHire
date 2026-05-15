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

// export const metadata: Metadata = {
//   title: "ScrollnHire | Hiring and Discovery Reimagined",
//   description:
//     "Scroll through real people, real work, and real opportunities — all in one platform designed for hiring and getting hired.",
// };

// FULL SEO + VERIFICATION SETUP
export const metadata: Metadata = {
  metadataBase: new URL("https://scrollnhire.vercel.app"),

  title: {
    default: "ScrollnHire | Hire Talent by Scrolling Real Work",
    template: "%s | ScrollnHire",
  },

  description:
    "Discover and hire developers, designers, and creators by watching real project videos instead of resumes.",

  keywords: [
    "hire developers",
    "video hiring platform",
    "portfolio hiring",
    "tiktok for hiring",
    "hire by projects",
    "developer hiring platform",
  ],

  verification: {
    google: "b35aUJ1ORXwWiIV1Lb7ATVrVdF_uEXraT2-cClJK9qQ",
  },

  openGraph: {
    title: "ScrollnHire – Hire Talent by Scrolling Real Work",
    description:
      "Hire developers and creators by scrolling real work instead of resumes.",
    url: "https://scrollnhire.vercel.app",
    siteName: "ScrollnHire",
    images: [
      {
        url: "/landing/employer_dashboard.png", // 👉 make sure this exists in /public
        width: 1200,
        height: 630,
        alt: "ScrollnHire Employer Dashboard Preview",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ScrollnHire",
    description: "Hire talent by scrolling real work",
    images: [
      "/landing/employer_dashboard.png",
      "/landing/student_dashboard.png",
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
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
