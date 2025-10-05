ALTER TABLE "users_spots" ADD COLUMN "file_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users_spots" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users_spots" ADD CONSTRAINT "users_spots_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;