CREATE TABLE "spots_attachments" (
	"spot_id" text NOT NULL,
	"file_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "spots_attachments_spot_id_file_id_pk" PRIMARY KEY("spot_id","file_id")
);
--> statement-breakpoint
ALTER TABLE "spots" ADD COLUMN "created_by" text;--> statement-breakpoint
ALTER TABLE "spots_attachments" ADD CONSTRAINT "spots_attachments_spot_id_spots_id_fk" FOREIGN KEY ("spot_id") REFERENCES "public"."spots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spots_attachments" ADD CONSTRAINT "spots_attachments_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spots" ADD CONSTRAINT "spots_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;