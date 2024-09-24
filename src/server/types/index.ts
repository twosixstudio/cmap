export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;
export type TaskStatusTypes = (typeof TASK_STATUSES)[number];

export const PROJECT_USER_ROLES = ["owner", "admin", "member"] as const;
export type ProjectUserRoleTypes = (typeof PROJECT_USER_ROLES)[number];

export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
    // Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export type ServerError = { success: false; error: { message: string } };

export type ServerReponse<T> =
  | {
      success: true;
      data: T;
    }
  | ServerError;

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

export type User = {
  id: string;
  name: string | null;
  image: string | null;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  userId: string;
  projectId: string;
};
