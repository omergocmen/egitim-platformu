import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db, now } from "@/lib/db";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireUser("admin");
  const { id } = await params;
  const { adminReply = "" } = await request.json();
  db.prepare("UPDATE comments SET adminReply = ?, updatedAt = ? WHERE id = ?").run(adminReply.trim() || null, now(), id);
  return NextResponse.json({ ok: true });
}
