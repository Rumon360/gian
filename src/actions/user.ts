"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return null;
  }
  return user;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return null;
  }
  return user;
};

export const checkSubscription = async () => {
  const session = await auth();
  if (!session || !session.user) {
    return {
      error: "Unauthorized",
    };
  }

  const DAY_IN_MS = 1000 * 60 * 24;

  const userSubscription = await prisma.userSubscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!userSubscription) {
    return {
      data: false,
    };
  }

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd &&
    userSubscription.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS > Date.now();

  return {
    data: !!isValid,
  };
};
