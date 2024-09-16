export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;
export type TaskStatusTypes = (typeof TASK_STATUSES)[number];

export const PROJECT_USER_ROLES = ["owner", "admin", "member"] as const;
export type ProjectUserRoleTypes = (typeof PROJECT_USER_ROLES)[number];
