"use client";

import { useEffect, useState } from "react";
import { createProject } from "~/server/api";
import { getThing } from "~/server/api/test";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function PageClient() {
  const session = useSession();
  // const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [d, setD] = useState<
    | {
        id: string;
        name: string | null;
        email: string;
        emailVerified: Date | null;
        image: string | null;
        projects: {
          projectId: string;
          userId: string;
          project: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date | null;
          };
        }[];
      }[]
    | undefined
  >();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getThing();
        setD(data);
        // Use the data or handle it as needed
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    void fetchData();
  }, []);
  if (session.status !== "authenticated")
    return <div>{JSON.stringify(session)}</div>;

  return (
    <div>
      {d?.map((x) =>
        x.projects.map((y) => (
          <Link href={`/projects/${y.projectId}`}>
            <p key={y.projectId}>{y.project.name}</p>
          </Link>
        )),
      )}
      <input
        className="border"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="bg-red-200"
        onClick={() => createProject(name || "New one", session.data.user?.id)}
      >
        Add client project
      </button>
    </div>
  );
}
