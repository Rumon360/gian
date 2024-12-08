"use client";

import { useSession } from "next-auth/react";
import { Loader2, Zap } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { useAction } from "@/hooks/use-action";
import { getStripeURL } from "../actions/stripe";
import { toast } from "sonner";

function SubscriptionAction() {
  const { data: session } = useSession();
  const { execute, isLoading } = useAction(undefined, getStripeURL, {
    onSuccess: (data) => {
      window.location.href = data.url as string;
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const credits = session?.user.credits ?? 0;
  const maxCredits = 10;
  const progress = (credits / maxCredits) * 100;

  function handleClick() {
    execute(undefined);
  }

  return (
    <div className="[background-image:url(/bg-light.webp)] dark:bg-none bg-center bg-no-repeat bg-cover  flex flex-col items-center w-full p-8 mx-auto mt-8 rounded-2xl border border-border bg-secondary/20 shadow">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-bold">Your Credits</h3>
      </div>
      <div className="relative w-full h-2 bg-secondary/30 rounded-full mb-4 overflow-hidden">
        <div
          className="absolute h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-shine" />
        </div>
      </div>

      <div className="text-sm font-medium text-muted-foreground mb-6">
        <span className="text-primary">{credits}</span>
        <span> / </span>
        <span>{maxCredits}</span>
        <span> free generations remaining</span>
      </div>

      <Button
        disabled={isLoading}
        onClick={handleClick}
        className="relative group px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium rounded-md shadow-lg transition-all duration-300 hover:shadow-primary/25"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : (
          <span className="relative z-10 flex items-center">
            Upgrade Pro
            <Zap className="w-4 h-4 ml-2" />
          </span>
        )}
      </Button>
    </div>
  );
}

export default SubscriptionAction;
