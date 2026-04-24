import { notFound } from "next/navigation";
import CoursePlayer from "@/components/CoursePlayer";
import { getCurrentUser } from "@/lib/auth";
import { CommentWithDetails, Course, db, Resource, Section } from "@/lib/db";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;
  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(id) as Course | undefined;
  if (!course) notFound();
  const sections = db.prepare('SELECT * FROM sections WHERE courseId = ? ORDER BY "order" ASC').all(id) as Section[];
  const resources = db.prepare("SELECT * FROM resources WHERE courseId = ? ORDER BY createdAt DESC").all(id) as Resource[];
  const comments = db.prepare(`
    SELECT comments.*, users.name as userName, sections.title as sectionTitle
    FROM comments
    JOIN users ON users.id = comments.userId
    LEFT JOIN sections ON sections.id = comments.sectionId
    WHERE comments.courseId = ?
    ORDER BY comments.createdAt DESC
  `).all(id) as CommentWithDetails[];
  return (
    <main className="page">
      <div className="course-head">
        <div>
          <p className="eyebrow">Course</p>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </div>
      </div>
      <CoursePlayer courseId={course.id} sections={sections} resources={resources} comments={comments} canComment={user?.role === "student"} />
    </main>
  );
}
