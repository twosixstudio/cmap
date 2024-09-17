CREATE TABLE IF NOT EXISTS "cmap_task_user" (
	"task_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cmap_task_user" ADD CONSTRAINT "cmap_task_user_task_id_cmap_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."cmap_task"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cmap_task_user" ADD CONSTRAINT "cmap_task_user_user_id_cmap_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."cmap_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
