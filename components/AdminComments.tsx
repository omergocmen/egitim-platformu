"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Comment = {
  id: number;
  content: string;
  adminReply?: string | null;
  userName: string;
  courseTitle: string;
  sectionTitle?: string | null;
};

export default function AdminComments({ comments }: { comments: Comment[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function reply(event: FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault();
    setMessage("");
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(`/api/comments/${id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setMessage(response.ok ? "Reply saved." : "Could not save reply.");
    router.refresh();
  }

  async function remove(id: number) {
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    setMessage("Comment deleted.");
    router.refresh();
  }

  return (
    <div className="stack" data-testid="admin-comments-page">
      {message && <p className="success" data-testid="comments-message">{message}</p>}
      {comments.length === 0 ? <p className="empty">No student comments yet.</p> : comments.map((comment) => (
        <article className="comment admin-comment" data-testid={`admin-comment-${comment.id}`} key={comment.id}>
          <p className="muted">{comment.courseTitle}{comment.sectionTitle ? ` / ${comment.sectionTitle}` : ""}</p>
          <strong>{comment.userName}</strong>
          <p>{comment.content}</p>
          <form onSubmit={(event) => reply(event, comment.id)}>
            <textarea data-testid={`reply-input-${comment.id}`} name="adminReply" defaultValue={comment.adminReply || ""} placeholder="Admin reply" />
            <div className="actions">
              <button className="button small" data-testid={`reply-button-${comment.id}`}>Save reply</button>
              <button className="danger small" type="button" data-testid={`delete-comment-${comment.id}`} onClick={() => remove(comment.id)}>Delete comment</button>
            </div>
          </form>
        </article>
      ))}
    </div>
  );
}
