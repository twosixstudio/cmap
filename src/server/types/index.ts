export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;
export type TaskStatusTypes = (typeof TASK_STATUSES)[number];

export const PROJECT_USER_ROLES = ["owner", "admin", "member"] as const;
export type ProjectUserRoleTypes = (typeof PROJECT_USER_ROLES)[number];

export type ServerReponseSuccess<T> = {
  success: true;
  data: T;
};

export type Error = {
  success: false;
  data: {
    error: string;
  };
};

export type ServerReponse<T> = ServerReponseSuccess<T> | Error;

export type Task = {
  id: string;
  name: string;
  status: TaskStatusTypes;
  createdAt: Date;
  users: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  }[];
  project: { name: string | null };
};
