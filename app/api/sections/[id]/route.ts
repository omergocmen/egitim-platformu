import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db, now } from "@/lib/db";
import { validateSectionYoutube } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  await requireUser("admin");
  const { id } = await params;
  const { title = "", description = "", youtubeUrl = "", order = "1" } = await request.json();
  if (!title.trim()) return NextResponse.json({ error: "Section title is required." }, { status: 400 });
  const error = validateSectionYoutube(youtubeUrl);
  if (error) return NextResponse.json({ error }, { status: 400 });
  db.prepare('UPDATE sections SET title = ?, description = ?, youtubeUrl = ?, "order" = ?, updatedAt = ? WHERE id = ?')
    .run(title.trim(), description.trim(), youtubeUrl.trim(), Number(order) || 1, now(), id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: Params) {
  await requireUser("admin");
  const { id } = await params;
  db.prepare("DELETE FROM sections WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
