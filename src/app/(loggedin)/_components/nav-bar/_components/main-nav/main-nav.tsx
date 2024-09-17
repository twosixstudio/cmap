"use client";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "~/utils/cn";

const ROUTES: { name: string; path: string; segment: string | null }[] = [
  { name: "Overview", path: "/", segment: null },
  { name: "Projects", path: "/projects", segment: "projects" },
  { name: "My Tasks", path: "/my-tasks", segment: "my-tasks" },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const segment = useSelectedLayoutSegment();
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {ROUTES.map((x) => (
        <Link
          key={x.path}
          href={x.path}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            segment === x.segment ? "" : "text-muted-foreground",
          )}
        >
          {x.name}
        </Link>
      ))}
    </nav>
  );
}
