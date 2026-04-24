import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import fs from "fs";
import os from "os";
import path from "path";
import { getYouTubeId } from "./youtube";

export type Role = "student" | "admin";

export type User = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
};

export type Course = {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Section = {
  id: number;
  courseId: number;
  title: string;
  description: string;
  youtubeUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type Resource = {
  id: number;
  courseId: number;
  sectionId: number | null;
  title: string;
  description: string;
  url: string;
  createdAt: string;
};

export type CommentWithDetails = {
  id: number;
  userId: number;
  courseId: number;
  sectionId: number | null;
  content: string;
  adminReply: string | null;
  createdAt: string;
  updatedAt: string;
  userName: string;
  courseTitle?: string;
  sectionTitle: string | null;
};

const dbPath =
  process.env.SQLITE_PATH ||
  (process.env.VERCEL ? path.join(os.tmpdir(), "education.db") : path.join(process.cwd(), "data", "education.db"));
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

function now() {
  return new Date().toISOString();
}

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('student', 'admin')),
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnailUrl TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  courseId INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  youtubeUrl TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY(courseId) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  courseId INTEGER NOT NULL,
  sectionId INTEGER,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  FOREIGN KEY(courseId) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY(sectionId) REFERENCES sections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  courseId INTEGER NOT NULL,
  sectionId INTEGER,
  content TEXT NOT NULL,
  adminReply TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(courseId) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY(sectionId) REFERENCES sections(id) ON DELETE CASCADE
);
`);

const adminExists = db.prepare("SELECT id FROM users WHERE email = ?").get("admin@example.com");
if (!adminExists) {
  db.prepare(
    "INSERT INTO users (name, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?)",
  ).run("Default Admin", "admin@example.com", bcrypt.hashSync("admin123", 10), "admin", now());
}

const courseCount = db.prepare("SELECT COUNT(*) as count FROM courses").get() as { count: number };
if (courseCount.count === 0) {
  const stamp = now();
  const course = db
    .prepare(
      "INSERT INTO courses (title, description, thumbnailUrl, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
    )
    .run(
      "Web Development Foundations",
      "A friendly introduction to HTML, CSS, JavaScript, and building for the web.",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      stamp,
      stamp,
    );
  const courseId = Number(course.lastInsertRowid);
  db.prepare(
    'INSERT INTO sections (courseId, title, description, youtubeUrl, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
  ).run(courseId, "HTML in 5 minutes", "Understand the basic structure of a web page.", "https://www.youtube.com/watch?v=salY_Sm6mv4", 1, stamp, stamp);
  const section = db.prepare(
    'INSERT INTO sections (courseId, title, description, youtubeUrl, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
  ).run(courseId, "CSS basics", "Add layout, spacing, color, and polish to your pages.", "https://www.youtube.com/watch?v=1PnVor36_40", 2, stamp, stamp);
  db.prepare(
    "INSERT INTO resources (courseId, sectionId, title, description, url, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(courseId, Number(section.lastInsertRowid), "MDN Web Docs", "Reference material for HTML, CSS, and browser APIs.", "https://developer.mozilla.org/", stamp);
}

const coursesWithoutSections = db.prepare(`
  SELECT courses.id, courses.thumbnailUrl
  FROM courses
  WHERE NOT EXISTS (SELECT 1 FROM sections WHERE sections.courseId = courses.id)
`).all() as { id: number; thumbnailUrl: string | null }[];

for (const course of coursesWithoutSections) {
  const youtubeId = getYouTubeId(course.thumbnailUrl || "");
  if (youtubeId) {
    const stamp = now();
    db.prepare(
      'INSERT INTO sections (courseId, title, description, youtubeUrl, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ).run(course.id, "Intro lesson", "Start here with the course video.", `https://www.youtube.com/watch?v=${youtubeId}`, 1, stamp, stamp);
  }
}

export { db, dbPath, now };
