ALTER TABLE "cmap_project" RENAME COLUMN "colortemp" TO "color";--> statement-breakpoint
ALTER TABLE "cmap_project" DROP COLUMN IF EXISTS "pet";