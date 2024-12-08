import { Chapter, Course, Unit } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  course: Course & { units: (Unit & { chapters: Chapter[] })[] };
};

function CourseCard({ course }: Props) {
  return (
    <div className="group border border-border rounded-lg overflow-hidden shadow">
      <div className="relative w-full">
        <Link
          href={`/course/${course.id}/0/0`}
          className="relative block w-full aspect-video"
        >
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="h-full w-full object-cover"
          />
        </Link>
        <span className="absolute px-3 py-1.5 bg-violet-500 text-white w-fit rounded-md bottom-3 left-3 text-sm font-bold shadow-md">
          {course.title}
        </span>
      </div>
      <div className="space-y-4 h-full">
        <div className="px-4 pt-4">
          <h4 className="text-sm text-secondary-foreground/80 font-semibold uppercase tracking-wide">
            Course Content
          </h4>
          <p className="text-sm text-secondary-foreground/60 mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-primary" />
              {course.units.length} units and{" "}
              {course.units.reduce(
                (acc, unit) => acc + unit.chapters.length,
                0
              )}{" "}
              chapters
            </span>
          </p>
        </div>
        <div className="space-y-2 pb-4 px-2">
          {course.units.map((unit, index) => (
            <Link
              href={`/course/${course.id}/${index}/0`}
              key={unit.id}
              className="group/unit flex items-center justify-between p-2.5 rounded-md hover:bg-secondary/40 transition-all duration-200 hover:pl-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center shrink-0 justify-center bg-violet-500/10 text-violet-500 size-7 rounded-full text-xs font-bold ring-1 ring-violet-500/20">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-secondary-foreground group-hover/unit:text-violet-500 transition-colors">
                  {unit.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
