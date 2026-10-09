import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { APP_NAME, APP_TAGLINE } from "@/lib/config";

export const metadata: Metadata = { title: `${APP_NAME}`, description: APP_TAGLINE };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body>
        <Sidebar />
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:pb-10 md:pl-24 md:pr-6 lg:pl-64">{children}</main>
      </body>
    </html>
  );
}
