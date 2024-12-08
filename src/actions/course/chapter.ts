"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { strict_output } from "@/lib/gpt";
import { getTranscript, searchYoutube } from "@/lib/youtube";
import { getChapterInfoSchema } from "@/validators/course";
import { z, ZodError } from "zod";
import { getQuestions } from "./questions";

type Input = z.infer<typeof getChapterInfoSchema>;

export const getChapterInfo = async (data: Input) => {
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  try {
    const { chapterId } = getChapterInfoSchema.parse(data);

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        unit: {
          course: { userId: session.user.id },
        },
      },
    });

    if (!chapter) {
      return { error: "Chapter not found" };
    }
    const videoId = await searchYoutube(chapter.youtubeSearchQuery);
    let transcript = await getTranscript(videoId);
    const maxLength = 300;
    transcript = transcript.split(" ").slice(0, maxLength).join(" ");

    const { summary }: { summary: string } = await strict_output(
      "You are an AI capable of summarising a youtube transcript",
      "summarise in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic, also do not introduce what the summary is about.\n" +
        transcript,
      { summary: "summary of the transcript" }
    );

    const questions = await getQuestions(transcript, chapter.name);

    await prisma.question.createMany({
      data: questions.map((question) => {
        let options = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ];
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          chapterId: chapterId,
        };
      }),
    });

    await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        videoId: videoId,
        summary: summary,
      },
    });

    return {
      success: true,
      data: {},
      msg: "Chapter info fetched successfully",
    };
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return { error: "Invalid data" };
    }
    return {
      error: "Failed to fetch chapter info",
    };
  }
};
