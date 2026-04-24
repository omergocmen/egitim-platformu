import AdminComments from "@/components/AdminComments";
import { requireUser } from "@/lib/auth";
import { CommentWithDetails, db } from "@/lib/db";

export default async function AdminCommentsPage() {
  await requireUser("admin");
  const comments = db.prepare(`
    SELECT comments.*, users.name as userName, courses.title as courseTitle, sections.title as sectionTitle
    FROM comments
    JOIN users ON users.id = comments.userId
    JOIN courses ON courses.id = comments.courseId
    LEFT JOIN sections ON sections.id = comments.sectionId
    ORDER BY comments.createdAt DESC
  `).all() as (CommentWithDetails & { courseTitle: string })[];
  return (
    <main className="page narrow">
      <p className="eyebrow">Admin</p>
      <h1>Student comments</h1>
      <AdminComments comments={comments} />
    </main>
  );
}
