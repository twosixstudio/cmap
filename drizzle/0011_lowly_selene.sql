ALTER TABLE "cmap_task" ADD COLUMN "project_id" varchar(255) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cmap_task" ADD CONSTRAINT "cmap_task_project_id_cmap_user_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."cmap_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
