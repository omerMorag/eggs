CREATE TYPE "public"."age_range_bucket" AS ENUM('<30', '30-34', '35-37', '38-40', '41+');--> statement-breakpoint
CREATE TYPE "public"."billing_type" AS ENUM('per_cycle', 'one_time', 'annual', 'per_visit');--> statement-breakpoint
CREATE TYPE "public"."cost_item_category" AS ENUM('clinic_cycle', 'private_doctor', 'medication', 'consultation', 'test', 'storage_annual', 'travel', 'other');--> statement-breakpoint
CREATE TYPE "public"."hmo_fund" AS ENUM('clalit', 'maccabi', 'meuhedet', 'leumit', 'none', 'other');--> statement-breakpoint
CREATE TYPE "public"."region" AS ENUM('מרכז', 'ירושלים', 'צפון', 'דרום', 'other');--> statement-breakpoint
CREATE TYPE "public"."report_reason" AS ENUM('misleading_info', 'personal_info_exposed', 'spam', 'inappropriate', 'other');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('open', 'reviewed', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."story_status" AS ENUM('pending', 'published', 'rejected', 'unpublished', 'removed');--> statement-breakpoint
CREATE TYPE "public"."treatment_route" AS ENUM('public', 'private', 'not_specified');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cost_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" "cost_item_category" NOT NULL,
	"label" text NOT NULL,
	"treatment_route" "treatment_route" DEFAULT 'not_specified' NOT NULL,
	"hmo" "hmo_fund",
	"clinic" text,
	"min_price" integer,
	"max_price" integer,
	"billing_type" "billing_type" NOT NULL,
	"source_url" text,
	"last_verified_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "saved_cost_estimates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"label" text,
	"input_data" jsonb NOT NULL,
	"min_total" integer NOT NULL,
	"max_total" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_user_id" text NOT NULL,
	"display_name" text,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"title" text NOT NULL,
	"story_text" text NOT NULL,
	"personal_tip" text,
	"age_range" "age_range_bucket",
	"hmo" "hmo_fund",
	"clinic" text,
	"region" "region",
	"treatment_route" "treatment_route",
	"cycles_count" integer,
	"retrieved_count" integer,
	"frozen_count" integer,
	"status" "story_status" DEFAULT 'pending' NOT NULL,
	"consent_version" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	"search_blob" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "story_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_id" uuid NOT NULL,
	"reporter_user_id" text NOT NULL,
	"reason" "report_reason" NOT NULL,
	"details" text,
	"status" "report_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "story_edit_audit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_id" uuid NOT NULL,
	"admin_user_id" text NOT NULL,
	"field_changes" jsonb NOT NULL,
	"edited_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "story_reports" ADD CONSTRAINT "story_reports_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "story_edit_audit" ADD CONSTRAINT "story_edit_audit_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cost_items_category_idx" ON "cost_items" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cost_items_active_idx" ON "cost_items" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cost_items_lookup_idx" ON "cost_items" USING btree ("category","treatment_route","hmo","clinic");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "saved_estimates_user_idx" ON "saved_cost_estimates" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stories_status_idx" ON "stories" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stories_public_feed_idx" ON "stories" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stories_author_idx" ON "stories" USING btree ("author_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "story_reports_story_idx" ON "story_reports" USING btree ("story_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "story_reports_status_idx" ON "story_reports" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "story_reports_unique_reporter" ON "story_reports" USING btree ("story_id","reporter_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "story_edit_audit_story_idx" ON "story_edit_audit" USING btree ("story_id");