import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, now } from "@/lib/db";
import { validateComment } from "@/lib/validation";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please log in as a student to comment." }, { status: 401 });
  if (user.role !== "student") return NextResponse.json({ error: "Only students can add comments." }, { status: 403 });
  const { courseId, sectionId = "", content = "" } = await request.json();
  const error = validateComment(content);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const stamp = now();
  db.prepare(
    "INSERT INTO comments (userId, courseId, sectionId, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(user.id, courseId, sectionId || null, content.trim(), stamp, stamp);
  return NextResponse.json({ ok: true });
}
