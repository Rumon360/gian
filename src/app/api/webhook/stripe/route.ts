import Stripe from "stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Initialize the Stripe instance with the secret key
const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

type StripeError = {
  message: string;
};

export async function POST(req: NextRequest) {
  // Get the raw body of the request as text (used to verify webhook signature)
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;

  // Verify the Stripe webhook signature to ensure the request is from Stripe
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse(`Webhook Error: ${error.message}`, {
        status: 400,
      });
    }
    return new NextResponse("Webhook Error occurred", { status: 400 });
  }

  // Extract the event data from the Stripe event
  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    // Event when a checkout session has been completed successfully
    case "checkout.session.completed": {
      // Retrieve the session object from Stripe
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      if (!session?.metadata?.userId) {
        return new NextResponse("Webhook Error. No UserId", { status: 400 });
      }

      await prisma.userSubscription.create({
        data: {
          userId: session.metadata.userId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });

      break;
    }

    // Event when an invoice payment succeeds
    case "invoice.payment_succeeded": {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      await prisma.userSubscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });
      break;
    }

    // Event when a subscription is deleted (canceled)
    case "customer.subscription.deleted": {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      const existingSubscription = await prisma.userSubscription.findFirst({
        where: {
          stripeSubscriptionId: subscription.id,
        },
      });

      if (!existingSubscription) {
        return new NextResponse("Subscription not found", { status: 404 });
      }

      await prisma.userSubscription.delete({
        where: { stripeSubscriptionId: existingSubscription.id },
      });

      break;
    }
  }

  return new NextResponse(null, { status: 200 });
}
