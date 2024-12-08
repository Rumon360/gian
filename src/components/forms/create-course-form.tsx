"use client";

import { createCourseSchema } from "@/validators/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
import { Loader2, Plus, Trash } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAction } from "@/hooks/use-action";
import { createCourse } from "@/actions/course/create";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Input = z.infer<typeof createCourseSchema>;

function CreateCourseForm() {
  const router = useRouter();
  const { execute, isLoading } = useAction(Input, createCourse, {
    onSuccess: (data) => {
      router.push(`/create/${data.courseId}`);
      toast.success("Course created successfully");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      units: ["", "", ""],
    },
  });

  function onSubmit(values: Input) {
    if (values.units.some((unit) => unit === "")) {
      toast.error("Please add at least one unit");
      return;
    }
    execute(values);
  }

  return (
    <div className="mt-10 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the main topic of the course (e.g. 'Introduction to React')"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AnimatePresence initial={false}>
            {form.watch("units").map((_, index) => {
              const placeHolders = [
                "Enter subtopic of the course (e.g. 'What is React?')",
                "Enter subtopic of the course (e.g. 'React Hooks and State')",
                "Enter subtopic of the course (e.g. 'Building React Components')",
              ];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormField
                    key={index}
                    control={form.control}
                    name={`units.${index}`}
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Unit {index + 1}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={
                              placeHolders[index] ||
                              "Enter subtopic of the course"
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>

          <div className="flex items-center justify-center py-6">
            <Separator className="flex-[1]" />
            <div className="mx-4 font-medium">
              <Button
                onClick={() => {
                  const currentUnits = form.getValues("units");
                  if (currentUnits.length < 3) {
                    form.setValue("units", [...currentUnits, ""]);
                  } else {
                    toast.error("You can only add up to 3 units");
                  }
                }}
                type="button"
                variant="secondary"
              >
                Add Unit
                <Plus className=" text-green-500" />
              </Button>
              <Button
                onClick={() => {
                  form.setValue("units", form.getValues("units").slice(0, -1));
                }}
                type="button"
                variant="secondary"
                className="ml-2"
              >
                Remove Unit
                <Trash className=" text-rose-500" />
              </Button>
            </div>
            <Separator className="flex-[1]" />
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            size={"lg"}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin" />
                <span className="ml-2">Creating...</span>
              </div>
            ) : (
              "Start Creating"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CreateCourseForm;
