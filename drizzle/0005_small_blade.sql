ALTER TABLE "cmap_project" ADD COLUMN "colortemp" varchar(255);--> statement-breakpoint
ALTER TABLE "cmap_project" DROP COLUMN IF EXISTS "color";