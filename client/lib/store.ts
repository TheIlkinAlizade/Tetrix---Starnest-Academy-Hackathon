"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// localStorage-da saxlanılan sadə state hook (hydration-safe).
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const ref = useRef<T>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as T;
        ref.current = parsed;
        setValue(parsed);
      }
    } catch {
      /* zədələnmiş məlumat: ilkin dəyər qalır */
    }
    setReady(true);
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === "function" ? (next as (p: T) => T)(ref.current) : next;
      ref.current = resolved;
      setValue(resolved);
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        /* storage doludur */
      }
    },
    [key]
  );

  return [value, set, ready] as const;
}

export const KEYS = {
  answers: "kompas.answers",
  profile: "kompas.profile",
  conversations: "kompas.conversations",
  actions: "kompas.actions",
  chat: "kompas.chat",
  eval: "kompas.eval",
  campaigns: "prodvisor.campaigns",
} as const;

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
