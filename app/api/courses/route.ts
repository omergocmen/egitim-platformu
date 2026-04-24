import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db, now } from "@/lib/db";
import { validateCourseTitle } from "@/lib/validation";
import { isValidYouTubeUrl, toYouTubeThumbnailUrl } from "@/lib/youtube";

export async function GET() {
  const courses = db.prepare("SELECT * FROM courses ORDER BY createdAt DESC").all();
  return NextResponse.json({ courses });
}

export async function POST(request: Request) {
  await requireUser("admin");
  const { title = "", description = "", thumbnailUrl = "", firstYoutubeUrl = "" } = await request.json();
  const error = validateCourseTitle(title);
  if (error) return NextResponse.json({ error }, { status: 400 });
  if (firstYoutubeUrl.trim() && !isValidYouTubeUrl(firstYoutubeUrl)) {
    return NextResponse.json({ error: "Please enter a valid YouTube URL." }, { status: 400 });
  }
  const stamp = now();
  const cleanThumbnailUrl = toYouTubeThumbnailUrl(thumbnailUrl) || toYouTubeThumbnailUrl(firstYoutubeUrl) || thumbnailUrl.trim();
  const result = db.prepare(
    "INSERT INTO courses (title, description, thumbnailUrl, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
  ).run(title.trim(), description.trim(), cleanThumbnailUrl, stamp, stamp);
  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(result.lastInsertRowid);
  if (firstYoutubeUrl.trim()) {
    db.prepare(
      'INSERT INTO sections (courseId, title, description, youtubeUrl, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ).run(result.lastInsertRowid, "Intro lesson", "Start here with the first course video.", firstYoutubeUrl.trim(), 1, stamp, stamp);
  }
  return NextResponse.json({ course });
}
