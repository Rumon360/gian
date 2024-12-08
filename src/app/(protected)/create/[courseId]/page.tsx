import { getCourseByID } from "@/actions/course";
import ConfirmChapters from "@/components/confirm-chapters";
import { Info } from "lucide-react";
import { redirect } from "next/navigation";

type CreateChaptersProps = {
  params: {
    courseId: string;
  };
};

async function CreateChapters({ params }: CreateChaptersProps) {
  const { courseId } = await params;
  const res = await getCourseByID(courseId);
  if (res.error || !res.data) {
    return redirect("/");
  }
  const { data } = res;

  return (
    <div className="flex flex-col items-start w-full h-full max-w-2xl mx-auto pb-10">
      <h5 className="text-sm uppercase text-secondary-foreground/60">
        Course Name
      </h5>
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-5 relative">
        {data.title}
      </h1>
      <div className="flex items-start p-6 mt-5 rounded-lg border border-border bg-secondary/20 shadow">
        <Info className="size-6 translate-y-0.5 mr-4 text-primary shrink-0" />
        <div className="space-y-3">
          <p className="font-semibold text-lg">How It Works</p>
          <p className="text-muted-foreground leading-relaxed">
            We have generated chapters for each of your units. Please review
            them, and then click the button to confirm and continue.
          </p>
        </div>
      </div>
      <ConfirmChapters course={data} />
    </div>
  );
}

export default CreateChapters;
