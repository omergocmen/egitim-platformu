import { notFound } from "next/navigation";
import CourseForm from "@/components/CourseForm";
import AdminContentForms from "@/components/AdminContentForms";
import { requireUser } from "@/lib/auth";
import { Course, db, Resource, Section } from "@/lib/db";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser("admin");
  const { id } = await params;
  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(id) as Course | undefined;
  if (!course) notFound();
  const sections = db.prepare('SELECT * FROM sections WHERE courseId = ? ORDER BY "order" ASC').all(id) as Section[];
  const resources = db.prepare("SELECT * FROM resources WHERE courseId = ? ORDER BY createdAt DESC").all(id) as Resource[];
  return (
    <main className="page narrow" data-testid="edit-course-page">
      <p className="eyebrow">Admin</p>
      <h1>Edit course</h1>
      <CourseForm course={course} />
      <AdminContentForms courseId={course.id} sections={sections} resources={resources} />
    </main>
  );
}
