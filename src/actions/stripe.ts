"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

const settingsUrl = process.env.NEXT_PUBLIC_URL + "/settings";

export const getStripeURL = async () => {
  const session = await auth();
  if (!session || !session.user) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const userSubscription = await prisma.userSubscription.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });
      return {
        success: true,
        data: {
          url: stripeSession.url,
        },
        msg: "URL Created Successfully",
      };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card", "paypal"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: session.user.email ?? "",
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Gian PRO",
              description: "Unlimited course generation",
            },
            unit_amount: 2000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
      },
    });
    return {
      success: true,
      data: {
        url: stripeSession.url,
      },
      msg: "URL Created Successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Something went wrong",
    };
  }
};
