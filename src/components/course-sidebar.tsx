import { cn } from "@/lib/utils";
import { Chapter, Course, Unit } from "@prisma/client";
import Link from "next/link";
import { Separator } from "./ui/separator";

type Props = {
  course: Course & { units: (Unit & { chapters: Chapter[] })[] };
  currentChapterId: string;
};

function CourseSidebar({ course, currentChapterId }: Props) {
  return (
    <div className="md:sticky md:top-8 p-6 w-full md:w-[400px] rounded-lg border border-border bg-secondary/20 shadow">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <div className="mt-4 space-y-4">
        {course.units.map((unit, index) => (
          <div
            key={unit.id}
            className="border-b pb-4 last:border-b-0 border-secondary-foreground/20 last:pb-0"
          >
            <h2 className="text-sm uppercase text-secondary-foreground/60 font-medium">
              Unit {index + 1}
            </h2>
            <h2 className="text-lg font-bold mt-1 leading-[1.2]">
              {unit.name}
            </h2>
            <ul className="mt-2 space-y-1.5">
              {unit.chapters.map((chapter, chapterIndex) => (
                <div key={chapter.id}>
                  <Link
                    href={`/course/${course.id}/${index}/${chapterIndex}`}
                    className={cn("text-secondary-foreground/60 text-base", {
                      "text-violet-500 font-bold":
                        chapter.id === currentChapterId,
                    })}
                  >
                    Chapter {chapterIndex + 1}: {chapter.name}
                  </Link>
                </div>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseSidebar;
