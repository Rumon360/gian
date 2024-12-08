import { getCourses } from "@/actions/course";
import CourseCard from "@/components/course-card";
import { redirect } from "next/navigation";
import React from "react";

async function Gallery() {
  const res = await getCourses();

  if (res.error || !res.data) {
    return redirect("/");
  }

  const { data } = res;

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {data.map((course) => (
        <div key={course.id} className="mb-4 break-inside-avoid">
          <CourseCard course={course} />
        </div>
      ))}
    </div>
  );
}

export default Gallery;
