DO $$ BEGIN
 CREATE TYPE "public"."roles" AS ENUM('owner', 'admin', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "cmap_project_user" ADD COLUMN "role" "roles";

UPDATE cmap_project_user
SET role = 'owner'
WHERE role IS NULL;