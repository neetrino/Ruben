ALTER TABLE "brands" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "brands_featured_sort_idx" ON "brands" USING btree ("is_featured","sort_order");