import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LessonCompleteButton } from "@/components/learn/lesson-complete-button";
import { ALL_LESSONS, getLesson } from "@/lib/learn-data";

export function generateStaticParams() {
  return ALL_LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = getLesson(slug);
  if (!found) return { title: "Lesson not found" };
  return { title: `${found.lesson.title} · Learn Trading` };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = getLesson(slug);
  if (!found) notFound();

  const { course, lesson } = found;

  return (
    <div>
      <Link
        href="/learn"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Academy
      </Link>

      <PageHeader title={lesson.title} description={lesson.summary}>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{course.level}</Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
            <Clock className="size-3" />
            {lesson.minutes} min read
          </span>
        </div>
      </PageHeader>

      <p className="-mt-2 mb-6 text-sm text-muted-foreground">
        From{" "}
        <Link
          href="/learn"
          className="font-medium text-primary hover:underline"
        >
          {course.title}
        </Link>
      </p>

      <Separator className="mb-6" />

      <article className="max-w-2xl space-y-4 leading-relaxed text-foreground/90">
        {lesson.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </article>

      <Separator className="my-8 max-w-2xl" />

      <div className="max-w-2xl">
        <LessonCompleteButton slug={lesson.slug} />
      </div>
    </div>
  );
}
