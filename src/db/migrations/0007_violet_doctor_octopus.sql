ALTER TABLE "delivery_rules" ADD COLUMN "country_translations" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
UPDATE "delivery_rules"
SET "country_translations" = jsonb_build_object(
  'hy', "country_code",
  'en', "country_code",
  'ru', "country_code"
)
WHERE "country_translations" = '{}'::jsonb
  AND "country_code" IS NOT NULL
  AND btrim("country_code") <> '';
