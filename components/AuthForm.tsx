"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error || "Something went wrong.");
      return;
    }
    router.push(data.role === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <form className="form-card" data-testid={`${mode}-form`} onSubmit={submit}>
      {mode === "register" && (
        <label>
          Name
          <input data-testid="name-input" name="name" placeholder="Jane Student" />
        </label>
      )}
      <label>
        Email
        <input data-testid="email-input" name="email" type="email" placeholder="you@example.com" />
      </label>
      <label>
        Password
        <input data-testid="password-input" name="password" type="password" placeholder="Password" />
      </label>
      {message && <p className="error" data-testid="form-error">{message}</p>}
      <button className="button" data-testid={`${mode}-submit`} disabled={loading}>
        {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
      </button>
    </form>
  );
}
