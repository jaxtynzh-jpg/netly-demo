import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Netly | AI-Powered Networking ROI Demo",
  description:
    "Netly is an AI-powered demo networking decision platform that helps fresh graduates decide which events are actually worth attending.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-background text-foreground antialiased`}>
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.24),_transparent_55%)]" />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className:
              "border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-900/10",
          }}
        />
      </body>
    </html>
  );
}
