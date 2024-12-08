"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      include: { units: { include: { chapters: true } } },
      orderBy: { createdAt: "desc" },
    });
    return {
      data: courses,
    };
  } catch (error) {
    return {
      error: "Failed to fetch courses",
    };
  }
}

export async function getCourseByID(id: string) {
  const session = await auth();

  if (!session || !session?.user) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: id, userId: session.user.id },
      include: { units: { include: { chapters: true } } },
    });
    if (!course) {
      return {
        error: "Course not found",
      };
    }
    return {
      data: course,
    };
  } catch (error) {
    return {
      error: "Failed to fetch course",
    };
  }
}

export async function getCourseWithQuizByID(id: string) {
  const session = await auth();

  if (!session || !session?.user) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: id, userId: session.user.id },
      include: {
        units: {
          include: {
            chapters: {
              include: {
                questions: true,
              },
            },
          },
        },
      },
    });
    if (!course) {
      return {
        error: "Course not found",
      };
    }
    return {
      data: course,
    };
  } catch (error) {
    return {
      error: "Failed to fetch course",
    };
  }
}
