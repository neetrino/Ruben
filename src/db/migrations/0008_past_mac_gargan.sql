ALTER TABLE "delivery_rules" ADD COLUMN "city_translations" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
UPDATE "delivery_rules"
SET "city_translations" = jsonb_build_object(
  'hy', COALESCE("city", ''),
  'en', COALESCE("city", ''),
  'ru', COALESCE("city", '')
)
WHERE "city_translations" = '{}'::jsonb
  AND "city" IS NOT NULL
  AND btrim("city") <> '';
