import { Chapter, Unit } from "@prisma/client";
import React from "react";

type Props = {
  chapter: Chapter;
  unit: Unit;
  unitIndex: number;
  chapterIndex: number;
};

function MainVideoSummary({ chapter, unit, unitIndex, chapterIndex }: Props) {
  return (
    <div className="w-full">
      <h4 className="text-sm uppercase text-secondary-foreground/60 font-medium">
        Unit {unitIndex + 1} &bull; Chapter {chapterIndex + 1}
      </h4>
      <h1 className="text-3xl mt-1 font-bold">{chapter.name}</h1>
      <iframe
        title="chapter video"
        className="w-full mt-4 aspect-video max-h-[24rem] rounded-lg shadow border border-secondary/60"
        src={`https://www.youtube.com/embed/${chapter.videoId}?si=${chapter.videoId}`}
        allowFullScreen
      />
      <div className="mt-4">
        <h3 className="text-xl font-bold">Summary</h3>
        <p className="mt-2 text-secondary-foreground/80">{chapter.summary}</p>
      </div>
    </div>
  );
}

export default MainVideoSummary;
