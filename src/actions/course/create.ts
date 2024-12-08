"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { strict_output } from "@/lib/gpt";
import { getUnsplashImage } from "@/lib/unsplash";
import { createCourseSchema } from "@/validators/course";
import { z, ZodError } from "zod";
import { checkSubscription } from "../user";

type Input = z.infer<typeof createCourseSchema>;

export const createCourse = async (data: Input) => {
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  const res = await checkSubscription();
  if (res.error) {
    return { error: "Failed to process" };
  }
  const isPro = res.data;

  if (session.user.credits <= 0 && isPro === false) {
    return {
      error: "No credit left. Please Upgrade to Pro",
    };
  }

  try {
    const { title, units } = createCourseSchema.parse(data);

    type OutputUnits = {
      title: string;
      chapters: {
        chapter_title: string;
        youtube_search_query: string;
      }[];
    }[];

    const outputUnits: OutputUnits = await strict_output(
      "You are an AI capable of curating course content, coming up with relevant chapter titles, and finding relevant YouTube videos for each chapter",
      new Array(units.length).fill(
        `It is your job to create a course about ${title}. 
        The user has requested to create chapters for each of the units. 
        Ensure that the total number of chapters does not exceed three. 
        Then for each chapter, provide a detailed YouTube search query 
        that can be used to find an informative educational video. 
        Each query should provide an educational and informative course on YouTube.`
      ),
      {
        title: "Title of the Unit",
        chapters: `An array of chapters. Ensure there are no more than five chapters, 
        and each chapter should have a youtube_search_query and chapter_title key in the JSON object`,
      }
    );

    const imageSearchTerm = await strict_output(
      "You are an AI capable of finding the most relevant image of a course",
      `Please provide a good image search term for the title of a course about ${title}.
      This search term will be fed into an unsplash API, so make sure it is a good search term that will return good results.`,
      {
        image_search_term: "a good search term for title of the course",
      }
    );

    const courseImageUrl = await getUnsplashImage(
      imageSearchTerm.image_search_term
    );

    const course = await prisma.course.create({
      data: {
        title: title,
        image: courseImageUrl,
        userId: session.user.id,
      },
    });

    for (const unit of outputUnits) {
      const title = unit.title;
      const db_unit = await prisma.unit.create({
        data: {
          name: title,
          courseId: course.id,
        },
      });
      await prisma.chapter.createMany({
        data: unit.chapters.map((chapter) => ({
          name: chapter.chapter_title,
          youtubeSearchQuery: chapter.youtube_search_query,
          unitId: db_unit.id,
        })),
      });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 1 } },
    });

    return {
      success: true,
      data: {
        courseId: course.id,
      },
      msg: "Course created successfully",
    };
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return { error: "Invalid data" };
    }
    return { error: "Failed to create course" };
  }
};
