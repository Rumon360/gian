import { getCourseWithQuizByID } from "@/actions/course";
import CourseSidebar from "@/components/course-sidebar";
import MainVideoSummary from "@/components/main-video-summary";
import Quiz from "@/components/quiz";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: {
    slug: string[];
  };
};

async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const [courseId, unitIndexParam, chapterIndexParam] = slug;
  const res = await getCourseWithQuizByID(courseId);

  if (res.error || !res.data) {
    return redirect("/gallery");
  }
  const { data } = res;

  const unitIndex = parseInt(unitIndexParam);
  const chapterIndex = parseInt(chapterIndexParam);

  const unit = data.units[unitIndex];

  if (!unit) {
    return redirect("/gallery");
  }

  const chapter = unit.chapters[chapterIndex];

  if (!chapter) {
    return redirect("/gallery");
  }

  const nextChapter = unit.chapters[chapterIndex + 1];
  const prevChapter = unit.chapters[chapterIndex - 1];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8 md:flex-row items-start w-full">
        <CourseSidebar course={data} currentChapterId={chapter.id} />
        <div className="w-full">
          <MainVideoSummary
            chapter={chapter}
            unit={unit}
            unitIndex={unitIndex}
            chapterIndex={chapterIndex}
          />
          {chapter.questions.length > 0 && <Quiz chapter={chapter} />}
        </div>
      </div>
      <div className="flex justify-center items-center my-8">
        <Separator className="flex-1" />
        <div className="flex gap-4 items-center mx-6">
          <Button
            disabled={!prevChapter}
            asChild
            variant={"outline"}
            className="group hover:bg-secondary/80 transition-all duration-200"
          >
            <Link
              href={`/course/${courseId}/${unitIndex}/${chapterIndex - 1}`}
              aria-disabled={!prevChapter}
              className={cn(
                "flex items-center gap-2",
                !prevChapter && "pointer-events-none opacity-50"
              )}
            >
              <ChevronLeft
                className="size-5 group-hover:-translate-x-0.5 transition-transform"
                strokeWidth={3}
              />
              <span>Previous Chapter</span>
            </Link>
          </Button>

          <Button
            disabled={!nextChapter}
            asChild
            variant={"outline"}
            className="group hover:bg-secondary/80 transition-all duration-200"
          >
            <Link
              href={`/course/${courseId}/${unitIndex}/${chapterIndex + 1}`}
              aria-disabled={!nextChapter}
              className={cn(
                "flex items-center gap-2",
                !nextChapter && "pointer-events-none opacity-50"
              )}
            >
              <span>Next Chapter</span>
              <ChevronRight
                className="size-5 group-hover:translate-x-0.5 transition-transform"
                strokeWidth={3}
              />
            </Link>
          </Button>
        </div>
        <Separator className="flex-1" />
      </div>
    </div>
  );
}

export default CoursePage;
