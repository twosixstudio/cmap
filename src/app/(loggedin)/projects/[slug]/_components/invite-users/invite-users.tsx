"use client";

import { useRouter } from "next/navigation";
import { inviteUserToProject } from "~/server/api/test";

export function InviteUsers(props: {
  users: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  }[];
  project:
    | {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        users: {
          projectId: string;
          userId: string;
          role: "owner" | "admin" | "member" | null;
          user: {
            id: string;
            name: string | null;
            email: string;
            emailVerified: Date | null;
            image: string | null;
          };
        }[];
      }
    | undefined;
}) {
  const router = useRouter();

  if (!props.project) return null;

  const projectUserIds = props.project.users.map((x) => x.userId);

  const handleInvite = async (userId: string) => {
    if (!props.project) return;
    try {
      await inviteUserToProject(props.project.id, userId, "member");
      router.refresh();
    } catch (error) {
      console.error("Failed to invite user to project:", error);
    }
  };

  return (
    <div>
      {props.project.users.map((x) => (
        <div key={x.userId}>{x.user.name}</div>
      ))}
      {props.users
        .filter((y) => !projectUserIds.includes(y.id))
        .map((x) => (
          <div key={x.id}>
            {x.name} {x.id}
            <button onClick={() => handleInvite(x.id)} className="bg-green-400">
              Add to project
            </button>
          </div>
        ))}
    </div>
  );
}
