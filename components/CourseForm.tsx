"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Course = { id?: number; title: string; description: string; thumbnailUrl?: string | null };

export default function CourseForm({ course }: { course?: Course }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(course?.id ? `/api/courses/${course.id}` : "/api/courses", {
      method: course?.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Could not save course.");
      return;
    }
    setSuccess("Course saved.");
    router.push(`/admin/courses/${data.course.id}/edit`);
    router.refresh();
  }

  async function remove() {
    if (!course?.id || !confirm("Delete this course?")) return;
    await fetch(`/api/courses/${course.id}`, { method: "DELETE" });
    router.push("/admin/courses");
    router.refresh();
  }

  return (
    <form className="form-card" data-testid="course-form" onSubmit={submit}>
      <label>
        Title
        <input data-testid="course-title-input" name="title" defaultValue={course?.title} />
      </label>
      <label>
        Description
        <textarea data-testid="course-description-input" name="description" defaultValue={course?.description} />
      </label>
      <label>
        Thumbnail image URL
        <input data-testid="course-thumbnail-input" name="thumbnailUrl" placeholder="Optional. If empty, the first YouTube lesson thumbnail is used." defaultValue={course?.thumbnailUrl || ""} />
      </label>
      {!course?.id && (
        <label>
          First lesson YouTube URL
          <input data-testid="course-first-youtube-input" name="firstYoutubeUrl" placeholder="Optional. Creates the first section automatically." />
        </label>
      )}
      {error && <p className="error" data-testid="course-error">{error}</p>}
      {success && <p className="success" data-testid="course-success">{success}</p>}
      <div className="actions">
        <button className="button" data-testid="save-course-button" disabled={loading}>
          {loading ? "Saving..." : "Save course"}
        </button>
        {course?.id && <button className="danger" type="button" data-testid="delete-course-button" onClick={remove}>Delete</button>}
      </div>
    </form>
  );
}
