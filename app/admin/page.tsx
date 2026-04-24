import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AdminPage() {
  await requireUser("admin");
  const courses = db.prepare("SELECT COUNT(*) as count FROM courses").get() as { count: number };
  const comments = db.prepare("SELECT COUNT(*) as count FROM comments").get() as { count: number };
  const sections = db.prepare("SELECT COUNT(*) as count FROM sections").get() as { count: number };
  return (
    <main className="page" data-testid="admin-dashboard-page">
      <section className="hero-band admin">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>Manage your learning platform</h1>
          <p>Create courses, add lesson videos and resources, and reply to student comments.</p>
        </div>
        <Link className="button" data-testid="new-course-link" href="/admin/courses/new">New course</Link>
      </section>
      <section className="stats">
        <div><strong>{courses.count}</strong><span>Courses</span></div>
        <div><strong>{sections.count}</strong><span>Sections</span></div>
        <div><strong>{comments.count}</strong><span>Comments</span></div>
      </section>
      <div className="admin-links">
        <Link className="card" data-testid="manage-courses-link" href="/admin/courses">Manage courses</Link>
        <Link className="card" data-testid="manage-comments-link" href="/admin/comments">Review comments</Link>
      </div>
    </main>
  );
}
