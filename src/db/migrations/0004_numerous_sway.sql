CREATE TABLE "compare_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "compare_items" ADD CONSTRAINT "compare_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compare_items" ADD CONSTRAINT "compare_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "compare_items_user_product_uidx" ON "compare_items" USING btree ("user_id","product_id");--> statement-breakpoint
CREATE INDEX "compare_items_user_created_idx" ON "compare_items" USING btree ("user_id","created_at");