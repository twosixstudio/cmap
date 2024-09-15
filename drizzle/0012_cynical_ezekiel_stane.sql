ALTER TABLE "cmap_task" DROP CONSTRAINT "cmap_task_project_id_cmap_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cmap_task" ADD CONSTRAINT "cmap_task_project_id_cmap_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."cmap_project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
