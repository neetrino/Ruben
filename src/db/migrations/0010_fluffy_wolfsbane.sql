CREATE TABLE "product_attribute_assignments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"product_id" uuid NOT NULL,
	"attribute_value_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_attribute_assignments" ADD CONSTRAINT "product_attribute_assignments_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attribute_assignments" ADD CONSTRAINT "product_attribute_assignments_attribute_value_id_product_attribute_values_id_fk" FOREIGN KEY ("attribute_value_id") REFERENCES "public"."product_attribute_values"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "product_attribute_assignments_uidx" ON "product_attribute_assignments" USING btree ("product_id","attribute_value_id");--> statement-breakpoint
CREATE INDEX "product_attribute_assignments_value_idx" ON "product_attribute_assignments" USING btree ("attribute_value_id");