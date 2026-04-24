import Link from "next/link";
import CourseCard from "@/components/CourseCard";
import { requireUser } from "@/lib/auth";
import { Course, db } from "@/lib/db";

type CourseListItem = Course & {
  firstYoutubeUrl: string | null;
  sectionCount: number;
};

export default async function DashboardPage() {
  const user = await requireUser("student");
  const courses = db.prepare(`
    SELECT
      courses.*,
      (SELECT youtubeUrl FROM sections WHERE sections.courseId = courses.id ORDER BY "order" ASC LIMIT 1) as firstYoutubeUrl,
      (SELECT COUNT(*) FROM sections WHERE sections.courseId = courses.id) as sectionCount
    FROM courses
    ORDER BY sectionCount DESC, createdAt DESC
    LIMIT 3
  `).all() as CourseListItem[];
  const commentCount = db.prepare("SELECT COUNT(*) as count FROM comments WHERE userId = ?").get(user.id) as { count: number };

  return (
    <main className="page" data-testid="student-dashboard-page">
      <section className="hero-band">
        <div>
          <p className="eyebrow">Student dashboard</p>
          <h1>Welcome back, {user.name}</h1>
          <p>Continue learning, browse available courses, and join the lesson discussion.</p>
        </div>
        <Link className="button" data-testid="browse-courses-button" href="/courses">Browse courses</Link>
      </section>
      <section className="stats">
        <div><strong>{courses.length}</strong><span>Featured courses</span></div>
        <div><strong>{commentCount.count}</strong><span>Your comments</span></div>
      </section>
      <section>
        <h2>Available courses</h2>
        <div className="course-grid">
          {courses.length === 0 ? <p className="empty">No courses available yet.</p> : courses.map((course) => (
            <CourseCard course={course} testId={`dashboard-course-${course.id}`} key={course.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
