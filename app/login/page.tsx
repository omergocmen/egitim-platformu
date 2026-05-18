import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="auth-page" data-testid="login-page">
      <section>
        <h1>Log in</h1>
        <AuthForm mode="login" />
        <p className="muted">Need a student account? <Link href="/register">Register</Link></p>
      </section>
    </main>
  );
}
