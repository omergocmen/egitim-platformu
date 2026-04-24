import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { Course, db } from "@/lib/db";

export default async function AdminCoursesPage() {
  await requireUser("admin");
  const courses = db.prepare("SELECT * FROM courses ORDER BY updatedAt DESC").all() as Course[];
  return (
    <main className="page" data-testid="admin-courses-page">
      <div className="page-title">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Courses</h1>
        </div>
        <Link
          aria-label="Create course"
          className="button"
          data-testid="create-course-button"
          href="/admin/courses/new"
          role="button"
        >
          Create course
        </Link>
      </div>
      <div className="list">
        {courses.length === 0 ? <p className="empty">No courses yet.</p> : courses.map((course) => (
          <Link className="row-card" data-testid={`admin-course-${course.id}`} href={`/admin/courses/${course.id}/edit`} key={course.id}>
            <strong>{course.title}</strong>
            <span>{course.description}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
