import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { APP_TAGLINE } from "@/lib/config";
export const metadata:Metadata={title:{default:"prodvisor. — AI Product & Growth Advisor",template:"%s | prodvisor."},description:APP_TAGLINE,icons:{icon:"/favicon.svg"}};
export const viewport:Viewport={width:"device-width",initialScale:1,viewportFit:"cover"};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="az"><body className="bg-bg font-sans text-ink antialiased"><AppShell>{children}</AppShell></body></html>}
