"use client";

import { cn } from "@/lib/utils";
import { Chapter, Question } from "@prisma/client";
import React, { useCallback, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";

type Props = {
  chapter: Chapter & { questions: Question[] };
};

function Quiz({ chapter }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionStatus, setQuestionStatus] = useState<
    Record<string, boolean | null>
  >({});

  const handleCheckAnswers = useCallback(() => {
    const newQuestionStatus = { ...questionStatus };
    chapter.questions.forEach((question) => {
      const user_answer = answers[question.id];
      if (!user_answer) return;
      if (user_answer === question.answer) {
        newQuestionStatus[question.id] = true;
      } else {
        newQuestionStatus[question.id] = false;
      }
      setQuestionStatus(newQuestionStatus);
    });
  }, [answers, chapter.questions, questionStatus]);

  return (
    <div className="mt-4">
      <h1 className="text-xl font-medium border-b pb-2">
        Check your knowledge
      </h1>
      <div className="mt-4 flex flex-col gap-y-4">
        {chapter.questions.map((question) => {
          const options = JSON.parse(question.options);
          return (
            <div
              key={question.id}
              className={cn(
                "p-4 rounded-lg bg-secondary/50 border border-border",
                questionStatus[question.id] === true &&
                  "bg-green-500/10  border-green-500",
                questionStatus[question.id] === false &&
                  "bg-red-500/10 border-red-500"
              )}
            >
              <h1 className="text-lg font-semibold">{question.question}</h1>
              <div className="mt-4">
                <RadioGroup
                  className="space-y-2"
                  onValueChange={(value) => {
                    setAnswers((prev) => ({ ...prev, [question.id]: value }));
                  }}
                >
                  {options.map((option: string) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <Button size={"lg"} onClick={handleCheckAnswers} className="text-base">
          Check answers
          <ChevronRight className="size-4" strokeWidth={4} />
        </Button>
      </div>
    </div>
  );
}

export default Quiz;
