import { auth } from "auth";
import Link from "next/link";

export async function Navigation() {
  const session = await auth();
  return (
    <div className="flex justify-between px-10 py-6">
      <div className="flex gap-2">
        <Link
          className="rounded-md bg-slate-600 px-4 py-2 text-sm font-bold text-slate-200"
          href="/"
        >
          Dashboard
        </Link>
        <Link
          className="rounded-md bg-slate-600 px-4 py-2 text-sm font-bold text-slate-200"
          href="/projects"
        >
          Projects
        </Link>
        <Link
          className="rounded-md bg-slate-600 px-4 py-2 text-sm font-bold text-slate-200"
          href="/my-tasks"
        >
          My Tasks
        </Link>
      </div>
      <Link
        href={session ? "/api/auth/signout" : "/api/auth/signin"}
        className="rounded-md bg-slate-200 px-4 py-2 text-sm font-bold text-slate-800"
      >
        {session ? "Sign out" : "Sign in"}
      </Link>
    </div>
  );
}
