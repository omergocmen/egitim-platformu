import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/auth";
import { db, now, User } from "@/lib/db";
import { validateAuth } from "@/lib/validation";

export async function POST(request: Request) {
  const { name = "", email = "", password = "" } = await request.json();
  const error = validateAuth(email, password);
  if (error) return NextResponse.json({ error }, { status: 400 });
  if (!name.trim()) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
  if (existing) return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });

  const result = db.prepare(
    "INSERT INTO users (name, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?)",
  ).run(name.trim(), email.toLowerCase(), await bcrypt.hash(password, 10), "student", now());
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid) as User;
  await setSessionCookie(await createSession(user));
  return NextResponse.json({ ok: true, role: user.role });
}
