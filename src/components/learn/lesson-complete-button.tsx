"use client";

import { Check, Circle } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";

export function LessonCompleteButton({ slug }: { slug: string }) {
  const [completed, setCompleted, hydrated] = useLocalStorage<string[]>(
    "cp_completed_lessons",
    [],
  );

  const done = hydrated && completed.includes(slug);

  function toggle() {
    setCompleted((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  return (
    <Button
      size="lg"
      variant={done ? "secondary" : "default"}
      onClick={toggle}
      disabled={!hydrated}
    >
      {done ? (
        <>
          <Check className="size-4" />
          Completed
        </>
      ) : (
        <>
          <Circle className="size-4" />
          Mark as complete
        </>
      )}
    </Button>
  );
}
