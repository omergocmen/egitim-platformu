import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db, now } from "@/lib/db";
import { validateSectionYoutube } from "@/lib/validation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireUser("admin");
  const { id } = await params;
  const { title = "", description = "", youtubeUrl = "", order = "1" } = await request.json();
  if (!title.trim()) return NextResponse.json({ error: "Section title is required." }, { status: 400 });
  const error = validateSectionYoutube(youtubeUrl);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const stamp = now();
  db.prepare(
    'INSERT INTO sections (courseId, title, description, youtubeUrl, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
  ).run(id, title.trim(), description.trim(), youtubeUrl.trim(), Number(order) || 1, stamp, stamp);
  return NextResponse.json({ ok: true });
}
