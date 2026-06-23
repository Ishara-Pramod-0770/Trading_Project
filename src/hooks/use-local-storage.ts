"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Persisted client state. Until the PostgreSQL/Prisma backend is wired up
 * (DATABASE_URL + server actions), the Journal, Portfolio, Alerts and Learn
 * progress features persist locally in the browser. The Prisma models already
 * exist; swapping these hooks for server actions is a drop-in change.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* ignore */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update, hydrated] as const;
}
