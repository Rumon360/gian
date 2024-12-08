import { checkSubscription } from "@/actions/user";
import SubscriptionButton from "@/components/subscription-button";
import { redirect } from "next/navigation";
import React from "react";

async function SettingsPage() {
  const res = await checkSubscription();

  if (res.error) {
    return redirect("/");
  }

  const isPro = res.data;

  return (
    <div className="max-w-3xl mx-auto [background-image:url(/bg-wrap.webp)] dark:[background-image:linear-gradient(rgba(3,7,18,0.8),rgba(3,7,18,0.8)),url(/wrap-two.webp)] bg-center bg-cover bg-no-repeat shadow rounded-lg p-6 border border-border">
      <h1 className="text-3xl font-bold text-neon">Settings</h1>
      <div>
        {isPro ? null : (
          <div className="mt-4">
            <span className="text-red-500 font-semibold">
              You are a FREE user. Consider upgrading to PRO for more features.
            </span>
          </div>
        )}
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
}

export default SettingsPage;
