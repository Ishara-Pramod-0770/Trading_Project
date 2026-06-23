"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  ALL_LESSONS,
  COURSES,
  LEVELS,
  type Level,
} from "@/lib/learn-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const LEVEL_BADGE: Record<Level, string> = {
  Beginner: "bg-profit/10 text-profit",
  Intermediate: "bg-primary/10 text-primary",
  Advanced: "bg-loss/10 text-loss",
};

export function Academy() {
  const [completed, , hydrated] = useLocalStorage<string[]>(
    "cp_completed_lessons",
    [],
  );

  const total = ALL_LESSONS.length;
  // Only count completion once hydrated so server and first client render match.
  const completedSet = new Set(hydrated ? completed : []);
  const doneCount = completedSet.size;
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Overall progress */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Your Progress</CardTitle>
              <CardDescription>
                Track lessons as you complete them. Progress is saved on this
                device.
              </CardDescription>
            </div>
            <span className="text-2xl font-bold tabular-nums">
              {hydrated ? `${percent}%` : "—"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={percent} />
          <p className="text-xs text-muted-foreground tabular-nums">
            {hydrated ? doneCount : 0} of {total} lessons completed
          </p>
        </CardContent>
      </Card>

      {/* Sections per level */}
      {LEVELS.map((level) => {
        const courses = COURSES.filter((c) => c.level === level);
        if (courses.length === 0) return null;

        return (
          <section key={level} className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold tracking-tight">{level}</h2>
              <Badge className={cn("border-0", LEVEL_BADGE[level])}>
                {courses.reduce((n, c) => n + c.lessons.length, 0)} lessons
              </Badge>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {courses.map((course) => {
                const courseDone = course.lessons.filter((l) =>
                  completedSet.has(l.slug),
                ).length;

                return (
                  <Card key={course.slug} className="glass">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-base">
                            {course.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {course.description}
                          </CardDescription>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                          {hydrated ? courseDone : 0}/{course.lessons.length}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      {course.lessons.map((lesson) => {
                        const done = completedSet.has(lesson.slug);
                        return (
                          <Link
                            key={lesson.slug}
                            href={`/learn/${lesson.slug}`}
                            className="group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-accent"
                          >
                            {done ? (
                              <CheckCircle2 className="size-4 shrink-0 text-profit" />
                            ) : (
                              <Circle className="size-4 shrink-0 text-muted-foreground/50" />
                            )}
                            <span
                              className={cn(
                                "flex-1 truncate text-sm font-medium",
                                done && "text-muted-foreground",
                              )}
                            >
                              {lesson.title}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
                              <Clock className="size-3" />
                              {lesson.minutes}m
                            </span>
                            <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
