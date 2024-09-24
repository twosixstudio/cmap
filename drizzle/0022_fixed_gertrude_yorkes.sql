CREATE TABLE IF NOT EXISTS "cmap_note" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cmap_note" ADD CONSTRAINT "cmap_note_user_id_cmap_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."cmap_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
