import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { APP_NAME, APP_TAGLINE } from "@/lib/config";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_TAGLINE,
  viewport: { width: "device-width", initialScale: 1, viewportFit: "cover" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body>
        <Sidebar />
        <main className="app-main mx-auto max-w-[1600px] min-w-0">{children}</main>
      </body>
    </html>
  );
}
