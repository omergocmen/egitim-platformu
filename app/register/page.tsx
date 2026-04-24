import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="auth-page" data-testid="register-page">
      <section>
        <h1>Create a student account</h1>
        <p className="muted">Start learning with the demo course catalog.</p>
        <AuthForm mode="register" />
        <p className="muted">Already registered? <Link href="/login">Log in</Link></p>
      </section>
    </main>
  );
}
