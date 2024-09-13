"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { createProject } from "~/server/api";
import { getThing } from "~/server/api/test";

export function PageClient() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [d, setD] = useState<
    | {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date | null;
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
  if (status !== "authenticated") return <div>No</div>;

  return (
    <div className="text-white">
      here:
      <pre>{JSON.stringify(d, null, 2)}</pre>
      <input
        className="text-black"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="bg-red-200"
        onClick={() => createProject(name || "New one", session?.user.id)}
      >
        Add client project
      </button>
    </div>
  );
}
