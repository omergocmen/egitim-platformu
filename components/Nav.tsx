import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Nav() {
  const user = await getCurrentUser();
  return (
    <header className="topbar">
      <Link className="brand" href={user?.role === "admin" ? "/admin" : "/dashboard"}>
        LearnLite
      </Link>
      <nav>
        <Link href={user?.role === "admin" ? "/admin/courses" : "/courses"}>{user?.role === "admin" ? "Manage courses" : "Courses"}</Link>
        {user?.role === "admin" && <Link href="/admin">Admin</Link>}
        {user ? (
          <>
            <span className="muted">{user.name}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link className="button small" href="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
