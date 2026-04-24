import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireUser("admin");
  const { id } = await params;
  db.prepare("DELETE FROM comments WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
