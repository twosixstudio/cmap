"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  inviteUserToProject,
  removeUserFromProject,
} from "~/server/services/project-users-services";
import { Button } from "~/ui/button";
import { Card, CardContent } from "~/ui/card";

export function InviteUsers(props: {
  users: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  }[];
  project: {
    id: string;
    name: string | null;
    amOwner: boolean;
    owners: {
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
    members:
      | {
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
        }[]
      | undefined;
  };
}) {
  const router = useRouter();

  const ownerIds = props.project.owners.map((x) => x.userId);

  const handleInvite = async (userId: string) => {
    try {
      await inviteUserToProject(props.project.id, userId, "member");
      router.refresh();
    } catch (error) {
      console.error("Failed to invite user to project:", error);
    }
  };

  async function handleRemoveUser(userId: string) {
    try {
      await removeUserFromProject({ projectId: props.project.id, userId });
      router.refresh();
    } catch (error) {
      console.error("Issue", error);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold">Add members</h2>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {props.users
              .filter((x) => !ownerIds.includes(x.id))
              .map((x) => {
                const isAdded = props.project.members
                  ?.map((y) => y.userId)
                  .includes(x.id);

                return (
                  <div
                    key={x.id}
                    className="flex w-full justify-between gap-10"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        className="rounded-full"
                        height={40}
                        width={40}
                        src={x.image ?? ""}
                        alt={x.name ?? ""}
                      />
                      <div className="flex flex-col text-sm leading-tight">
                        <p className="font-semibold">{x.name}</p>
                        <p className="text-muted-foreground">{x.email}</p>
                      </div>
                    </div>
                    {isAdded ? (
                      <Button
                        onClick={() => handleRemoveUser(x.id)}
                        variant="outline"
                        size="sm"
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleInvite(x.id)}
                        variant="outline"
                        size="sm"
                      >
                        Add
                      </Button>
                    )}
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
