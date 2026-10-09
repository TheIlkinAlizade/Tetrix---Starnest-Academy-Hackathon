"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { KEYS } from "@/lib/store";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace(localStorage.getItem(KEYS.profile) ? "/dashboard" : "/onboarding");
  }, [router]);
  return null;
}
