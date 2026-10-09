import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { APP_NAME, APP_TAGLINE } from "@/lib/config";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_TAGLINE,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <body className="flex min-h-screen bg-white text-ink antialiased">
        <Sidebar />
        <main className="app-main min-w-0 flex-1 w-full max-w-[1600px] mx-auto has-[:where(.landing-page)]:max-w-none has-[:where(.landing-page)]:p-0 has-[:where(.landing-page)]:m-0">
          {children}
        </main>
      </body>
    </html>
  );
}