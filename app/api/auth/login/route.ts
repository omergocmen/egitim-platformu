import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/auth";
import { db, User } from "@/lib/db";
import { validateAuth } from "@/lib/validation";

export async function POST(request: Request) {
  const { email = "", password = "" } = await request.json();
  const error = validateAuth(email, password);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()) as User | undefined;
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await setSessionCookie(await createSession(user));
  return NextResponse.json({ ok: true, role: user.role });
}
