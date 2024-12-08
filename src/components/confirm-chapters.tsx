"use client";

import { Chapter, Course, Unit } from "@prisma/client";
import React, { createRef, RefObject, useMemo, useState } from "react";
import ChapterCard, { ChapterCardHandler } from "./chapter-card";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
};

function ConfirmChapters({ course }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const chapterRefs: Record<string, RefObject<ChapterCardHandler>> = {};

  const [completedChapters, setCompletedChapters] = useState<Set<string>>(
    new Set()
  );

  const totalChapters = useMemo(() => {
    return course.units.reduce((acc, unit) => {
      return acc + unit.chapters.length;
    }, 0);
  }, [course.units]);

  course.units.forEach((unit) => {
    unit.chapters.forEach((chapter) => {
      chapterRefs[chapter.id] = createRef<ChapterCardHandler>();
    });
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const promises = Object.values(chapterRefs).map((ref) => {
        return ref.current?.trigger();
      });
      await Promise.allSettled(promises);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-10 w-full space-y-5">
      <p className="text-sm text-muted-foreground">
        Note: If a chapter generation fails, you can refresh the page and try to
        generate it again.
      </p>
      {course.units.map((unit, index) => (
        <div key={unit.id}>
          <h2 className="text-sm uppercase text-secondary-foreground/60">
            Unit {index + 1}
          </h2>
          <h3 className="text-xl sm:text-2xl font-bold">{unit.name}</h3>
          <div className="mt-3 space-y-4">
            {unit.chapters.map((chapter, chapterIndex) => (
              <ChapterCard
                ref={chapterRefs[chapter.id]}
                key={chapter.id}
                chapter={chapter}
                chapterIndex={chapterIndex}
                completedChapters={completedChapters}
                setCompletedChapters={setCompletedChapters}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-center items-center mt-5">
        <Separator className="flex-1" />
        <div className="flex gap-2 items-center mx-4">
          <Button asChild variant={"secondary"}>
            <Link href={"/create"}>
              <ChevronLeft className="size-4" strokeWidth={4} />
              Go back
            </Link>
          </Button>
          {totalChapters === completedChapters.size ? (
            <Button asChild variant={"secondary"}>
              <Link href={`/course/${course.id}/0/0`}>
                Done <ChevronRight className="size-4" strokeWidth={4} />
              </Link>
            </Button>
          ) : (
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
              <ChevronRight className="size-4" strokeWidth={4} />
            </Button>
          )}
        </div>
        <Separator className="flex-1" />
      </div>
    </div>
  );
}

export default ConfirmChapters;
