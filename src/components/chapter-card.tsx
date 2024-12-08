"use client";

import { getChapterInfo } from "@/actions/course/chapter";
import { useAction } from "@/hooks/use-action";
import { cn } from "@/lib/utils";
import { getChapterInfoSchema } from "@/validators/course";
import { Chapter } from "@prisma/client";
import { CheckCircle2, XCircle, CircleDashed } from "lucide-react";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { z } from "zod";

type Props = {
  chapter: Chapter;
  chapterIndex: number;
  completedChapters: Set<string>;
  setCompletedChapters: React.Dispatch<React.SetStateAction<Set<string>>>;
};

export type ChapterCardHandler = {
  trigger: () => Promise<void>;
};

type getChapterInfoSchema = z.infer<typeof getChapterInfoSchema>;

const ChapterCard = forwardRef<ChapterCardHandler, Props>(
  ({ chapter, chapterIndex, completedChapters, setCompletedChapters }, ref) => {
    const { execute } = useAction(getChapterInfoSchema, getChapterInfo, {
      onSuccess: () => {
        setSuccess(true);
        addChapterIdSet();
      },
      onError: (error) => {
        setSuccess(false);
        addChapterIdSet();
      },
    });
    const [success, setSuccess] = useState<boolean | null>(null);

    const addChapterIdSet = useCallback(() => {
      setCompletedChapters((prev) => {
        const newSet = new Set(prev);
        newSet.add(chapter.id);
        return newSet;
      });
    }, [chapter.id, setCompletedChapters]);

    useEffect(() => {
      if (chapter.videoId) {
        setSuccess(true);
        addChapterIdSet();
      }
    }, [addChapterIdSet, chapter.videoId]);

    useImperativeHandle(ref, () => ({
      trigger: () => {
        if (chapter.videoId) {
          addChapterIdSet();
          return Promise.resolve();
        }
        return new Promise<void>((resolve, reject) => {
          execute({ chapterId: chapter.id })
            .then(() => resolve())
            .catch((error: any) => reject(error));
        });
      },
    }));

    return (
      <div
        className={cn(
          "px-6 py-4 rounded-lg flex items-center justify-between",
          "transition-all duration-200 hover:shadow-md",
          {
            "bg-secondary/50 border border-border": success === null,
            "bg-green-500/10 border border-green-500": success === true,
            "bg-red-500/10 border border-red-500": success === false,
          }
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary-foreground/10">
            <span className="text-sm font-medium">{chapterIndex + 1}</span>
          </div>
          <h5 className="font-medium text-lg">{chapter.name}</h5>
        </div>
        <div className="text-lg">
          {success === null && (
            <CircleDashed className="text-muted-foreground" />
          )}
          {success === true && <CheckCircle2 className="text-green-500" />}
          {success === false && <XCircle className="text-red-500" />}
        </div>
      </div>
    );
  }
);

ChapterCard.displayName = "ChapterCard";

export default ChapterCard;
