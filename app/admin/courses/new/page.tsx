import CourseForm from "@/components/CourseForm";
import { requireUser } from "@/lib/auth";

export default async function NewCoursePage() {
  await requireUser("admin");
  return (
    <main className="page narrow" data-testid="new-course-page">
      <p className="eyebrow">Admin</p>
      <h1>Create course</h1>
      <CourseForm />
    </main>
  );
}
