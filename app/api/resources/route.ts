import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db, now } from "@/lib/db";

export async function POST(request: Request) {
  await requireUser("admin");
  const { courseId, sectionId = "", title = "", description = "", url = "" } = await request.json();
  if (!title.trim()) return NextResponse.json({ error: "Resource title is required." }, { status: 400 });
  if (!url.trim()) return NextResponse.json({ error: "Resource URL is required." }, { status: 400 });
  db.prepare("INSERT INTO resources (courseId, sectionId, title, description, url, createdAt) VALUES (?, ?, ?, ?, ?, ?)")
    .run(courseId, sectionId || null, title.trim(), description.trim(), url.trim(), now());
  return NextResponse.json({ ok: true });
}
