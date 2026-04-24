"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toYouTubeEmbedUrl, toYouTubeThumbnailUrl } from "@/lib/youtube";

type Section = { id: number; title: string; description: string; youtubeUrl: string; order: number };
type Resource = { id: number; title: string; description: string; url: string; sectionId?: number | null };
type Comment = { id: number; content: string; adminReply?: string | null; createdAt: string; userName: string; sectionTitle?: string | null };

export default function CoursePlayer({
  courseId,
  sections,
  resources,
  comments,
  canComment,
}: {
  courseId: number;
  sections: Section[];
  resources: Resource[];
  comments: Comment[];
  canComment: boolean;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(sections[0]?.id || 0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const selected = sections.find((section) => section.id === selectedId) || sections[0];
  const embedUrl = selected ? toYouTubeEmbedUrl(selected.youtubeUrl) : "";
  const thumbnailUrl = selected ? toYouTubeThumbnailUrl(selected.youtubeUrl) : "";
  const visibleResources = useMemo(
    () => resources.filter((resource) => !resource.sectionId || resource.sectionId === selected?.id),
    [resources, selected],
  );

  async function comment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setLoading(true);
    const body = { ...Object.fromEntries(new FormData(form)), courseId, sectionId: selected?.id || "" };
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Could not add comment.");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <div className="course-layout" data-testid="course-detail-page">
      <aside className="side-panel">
        <div className="side-title">
          <p className="eyebrow">Curriculum</p>
          <h2>Sections</h2>
        </div>
        {sections.length === 0 ? <p className="empty">No sections available yet.</p> : sections.map((section) => (
          <button
            key={section.id}
            className={section.id === selected?.id ? "section active" : "section"}
            data-testid={`section-button-${section.id}`}
            onClick={() => setSelectedId(section.id)}
          >
            <span>{section.order}. {section.title}</span>
            <small>{section.description}</small>
          </button>
        ))}
      </aside>
      <main className="lesson-panel">
        {!selected ? (
          <p className="empty">No lesson selected.</p>
        ) : (
          <>
            <div className="video-frame">
              {embedUrl ? (
                <>
                  {thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="video-poster" src={thumbnailUrl} alt="" />
                  )}
                  <iframe
                    data-testid="youtube-iframe"
                    src={embedUrl}
                    title={selected.title}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </>
              ) : (
                <div className="video-empty">Invalid YouTube URL</div>
              )}
            </div>
            <div className="lesson-meta">
              <span>Lesson {selected.order}</span>
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
              <a href={selected.youtubeUrl} target="_blank" rel="noreferrer">Open on YouTube</a>
            </div>
          </>
        )}

        <section className="lesson-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Materials</p>
              <h2>Resources</h2>
            </div>
          </div>
          {visibleResources.length === 0 ? <p className="empty">No resources for this lesson yet.</p> : (
            <div className="cards compact">
              {visibleResources.map((resource) => (
                <a className="card" data-testid={`resource-link-${resource.id}`} href={resource.url} key={resource.id}>
                  <strong>{resource.title}</strong>
                  <span>{resource.description}</span>
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="lesson-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Discussion</p>
              <h2>Comments</h2>
            </div>
          </div>
          {canComment ? (
            <form className="comment-form" data-testid="comment-form" onSubmit={comment}>
              <textarea data-testid="comment-input" name="content" placeholder="Ask a question or share a note" />
              {error && <p className="error" data-testid="comment-error">{error}</p>}
              <button className="button" data-testid="submit-comment-button" disabled={loading}>
                {loading ? "Posting..." : "Add comment"}
              </button>
            </form>
          ) : (
            <div className="empty inline-empty">
              <span>Log in as a student to comment.</span>
              <Link className="button small" data-testid="login-to-comment-link" href="/login">Log in</Link>
            </div>
          )}
          <div className="comments">
            {comments.length === 0 ? <p className="empty">No comments yet.</p> : comments.map((comment) => (
              <article className="comment" data-testid={`comment-${comment.id}`} key={comment.id}>
                <strong>{comment.userName}</strong>
                <p>{comment.content}</p>
                {comment.adminReply && <p className="reply" data-testid={`admin-reply-${comment.id}`}>Admin reply: {comment.adminReply}</p>}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
