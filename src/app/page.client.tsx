"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProject } from "~/server/api";

export function PageClient() {
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const router = useRouter();

  return (
    <div>
      <input
        className="border"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
      />
      <button
        className="bg-red-200"
        onClick={async () => {
          await createProject(name);
          router.refresh();
          setName("");
          setSubtitle("");
        }}
      >
        Add client project
      </button>
    </div>
  );
}
