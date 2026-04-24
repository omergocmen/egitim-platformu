import Link from "next/link";
import CourseCard from "@/components/CourseCard";
import { Course, db } from "@/lib/db";

type CourseListItem = Course & {
  firstYoutubeUrl: string | null;
  sectionCount: number;
};

export default async function CoursesPage() {
  const courses = db.prepare(`
    SELECT
      courses.*,
      (SELECT youtubeUrl FROM sections WHERE sections.courseId = courses.id ORDER BY "order" ASC LIMIT 1) as firstYoutubeUrl,
      (SELECT COUNT(*) FROM sections WHERE sections.courseId = courses.id) as sectionCount
    FROM courses
    ORDER BY sectionCount DESC, createdAt DESC
  `).all() as CourseListItem[];
  return (
    <main className="page" data-testid="courses-page">
      <div className="page-title catalog-title">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Explore practical courses</h1>
          <p className="muted">Browse lessons freely. Create a student account when you want to join the discussion.</p>
        </div>
        <Link className="button ghost" data-testid="catalog-login-link" href="/login">Student login</Link>
      </div>
      <div className="course-grid">
        {courses.length === 0 ? <p className="empty">No courses available yet.</p> : courses.map((course) => (
          <CourseCard course={course} testId={`course-card-${course.id}`} key={course.id} />
        ))}
      </div>
    </main>
  );
}
