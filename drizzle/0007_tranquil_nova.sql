-- ALTER TABLE "cmap_project" ADD COLUMN "subtitle" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "cmap_project" DROP COLUMN IF EXISTS "color";