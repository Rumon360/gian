"use client";

import { useAction } from "@/hooks/use-action";
import { Button } from "./ui/button";
import { Loader2, Zap } from "lucide-react";
import { getStripeURL } from "@/actions/stripe";
import { toast } from "sonner";

type Props = {
  isPro: boolean | undefined;
};

function SubscriptionButton({ isPro }: Props) {
  const { execute, isLoading } = useAction(undefined, getStripeURL, {
    onSuccess: (data) => {
      window.location.href = data.url as string;
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  function handleClick() {
    execute(undefined);
  }

  return (
    <Button
      className="relative mt-4 group px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium rounded-md shadow-lg transition-all duration-300 hover:shadow-primary/25"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <span className="flex items-center justify-center">
          {isPro ? "Manage Subscription" : "Upgrade"}
          <Zap className="w-4 h-4 ml-2" />
        </span>
      )}
    </Button>
  );
}

export default SubscriptionButton;
