ALTER TABLE "cmap_note" ADD COLUMN "project_id" varchar(255) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cmap_note" ADD CONSTRAINT "cmap_note_project_id_cmap_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."cmap_project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
