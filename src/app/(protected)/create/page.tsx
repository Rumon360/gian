import { checkSubscription } from "@/actions/user";
import CreateCourseForm from "@/components/forms/create-course-form";
import SubscriptionAction from "@/components/subscription-action";
import { Info } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

async function CreatePage() {
  const res = await checkSubscription();

  if (res.error) {
    return redirect("/");
  }

  const isPro = res.data;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto pb-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-5 relative">
        Create a Course
      </h1>
      <div className="flex items-start p-6 mt-5 rounded-lg border border-border bg-secondary/20 shadow">
        <Info className="size-6 translate-y-0.5 mr-4 text-primary shrink-0" />
        <div className="space-y-3">
          <p className="font-semibold text-lg">How It Works</p>
          <p className="text-muted-foreground leading-relaxed">
            Enter the course title or topic you&apos;re interested in, and
            specify the units or specific areas you&apos;d like to explore. Our
            AI will then create a customized, comprehensive course designed to
            meet your learning objectives.
          </p>
        </div>
      </div>
      <CreateCourseForm />
      {!isPro && <SubscriptionAction />}
    </div>
  );
}

export default CreatePage;
