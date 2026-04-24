"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Section = { id: number; title: string; description: string; youtubeUrl: string; order: number };
type Resource = { id: number; title: string; description: string; url: string; sectionId?: number | null };

export default function AdminContentForms({
  courseId,
  sections,
  resources,
}: {
  courseId: number;
  sections: Section[];
  resources: Resource[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function submit(path: string, body: Record<string, FormDataEntryValue>, method = "POST") {
    setMessage("");
    const response = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) setMessage(data.error || "Could not save.");
    else {
      setMessage("Saved.");
      router.refresh();
    }
  }

  function addSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(`/api/courses/${courseId}/sections`, Object.fromEntries(new FormData(event.currentTarget)));
    event.currentTarget.reset();
  }

  function addResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit("/api/resources", { ...Object.fromEntries(new FormData(event.currentTarget)), courseId: String(courseId) });
    event.currentTarget.reset();
  }

  return (
    <div className="stack" data-testid="admin-content-forms">
      {message && <p className={message === "Saved." ? "success" : "error"} data-testid="admin-content-message">{message}</p>}
      <form className="form-card" data-testid="section-form" onSubmit={addSection}>
        <h2>Add video section</h2>
        <p className="muted">Course videos appear on the student detail page after you add them as sections.</p>
        <input data-testid="section-title-input" name="title" placeholder="Section title" />
        <textarea data-testid="section-description-input" name="description" placeholder="Description" />
        <input data-testid="section-youtube-input" name="youtubeUrl" placeholder="https://www.youtube.com/watch?v=..." />
        <input data-testid="section-order-input" name="order" type="number" placeholder="Order" defaultValue={sections.length + 1} />
        <button className="button" data-testid="add-section-button">Add section</button>
      </form>

      <div className="list">
        <h2>Sections</h2>
        {sections.length === 0 ? <p className="empty">No sections yet.</p> : sections.map((section) => (
          <form key={section.id} className="row-card" data-testid={`section-${section.id}-form`} onSubmit={(event) => {
            event.preventDefault();
            submit(`/api/sections/${section.id}`, Object.fromEntries(new FormData(event.currentTarget)), "PUT");
          }}>
            <input name="title" defaultValue={section.title} />
            <input name="youtubeUrl" defaultValue={section.youtubeUrl} />
            <input name="order" type="number" defaultValue={section.order} />
            <textarea name="description" defaultValue={section.description} />
            <div className="actions">
              <button className="button small" data-testid={`save-section-${section.id}`}>Save</button>
              <button className="danger small" type="button" data-testid={`delete-section-${section.id}`} onClick={() => submit(`/api/sections/${section.id}`, {}, "DELETE")}>Delete</button>
            </div>
          </form>
        ))}
      </div>

      <form className="form-card" data-testid="resource-form" onSubmit={addResource}>
        <h2>Add resource</h2>
        <input data-testid="resource-title-input" name="title" placeholder="Resource title" />
        <textarea data-testid="resource-description-input" name="description" placeholder="Description" />
        <input data-testid="resource-url-input" name="url" placeholder="https://example.com" />
        <select data-testid="resource-section-select" name="sectionId" defaultValue="">
          <option value="">Whole course</option>
          {sections.map((section) => <option key={section.id} value={section.id}>{section.title}</option>)}
        </select>
        <button className="button" data-testid="add-resource-button">Add resource</button>
      </form>

      <div className="list">
        <h2>Resources</h2>
        {resources.length === 0 ? <p className="empty">No resources yet.</p> : resources.map((resource) => (
          <div className="row-card" key={resource.id} data-testid={`resource-${resource.id}`}>
            <strong>{resource.title}</strong>
            <span>{resource.description}</span>
            <a href={resource.url}>{resource.url}</a>
            <button className="danger small" data-testid={`delete-resource-${resource.id}`} onClick={() => submit(`/api/resources/${resource.id}`, {}, "DELETE")}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
