import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db, now } from "@/lib/db";
import { validateCourseTitle } from "@/lib/validation";
import { toYouTubeThumbnailUrl } from "@/lib/youtube";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  await requireUser("admin");
  const { id } = await params;
  const { title = "", description = "", thumbnailUrl = "" } = await request.json();
  const error = validateCourseTitle(title);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const cleanThumbnailUrl = toYouTubeThumbnailUrl(thumbnailUrl) || thumbnailUrl.trim();
  db.prepare("UPDATE courses SET title = ?, description = ?, thumbnailUrl = ?, updatedAt = ? WHERE id = ?")
    .run(title.trim(), description.trim(), cleanThumbnailUrl, now(), id);
  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(id);
  return NextResponse.json({ course });
}

export async function DELETE(_: Request, { params }: Params) {
  await requireUser("admin");
  const { id } = await params;
  db.prepare("DELETE FROM courses WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
