import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_properties_payment_schemes_balance_mode" AS ENUM('cash', 'bank', 'pag-ibig', 'in-house');
  CREATE TYPE "public"."enum_properties_status" AS ENUM('pre-selling', 'under-construction', 'ready-for-occupancy', 'sold-out');
  CREATE TYPE "public"."enum_inquiries_preferred_channel" AS ENUM('call', 'viber', 'whatsapp', 'messenger', 'email');
  CREATE TYPE "public"."enum_inquiries_visit_mode" AS ENUM('on-site', 'video-call');
  ALTER TYPE "public"."enum_inquiries_status" ADD VALUE 'scheduled' BEFORE 'closed';
  ALTER TYPE "public"."enum_inquiries_status" ADD VALUE 'visited' BEFORE 'closed';
  CREATE TABLE "properties_payment_schemes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"down_payment_percent" numeric,
  	"down_payment_months" numeric,
  	"balance_percent" numeric,
  	"balance_mode" "enum_properties_payment_schemes_balance_mode",
  	"note" varchar
  );
  
  CREATE TABLE "properties_unit_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"area_range" varchar,
  	"price_from" varchar
  );
  
  ALTER TABLE "inquiries" ALTER COLUMN "inquiry_type" SET DATA TYPE text;
  ALTER TABLE "inquiries" ALTER COLUMN "inquiry_type" SET DEFAULT 'property-information'::text;
  UPDATE "inquiries" SET "inquiry_type" = 'viewing' WHERE "inquiry_type" = 'schedule-viewing';
  DROP TYPE "public"."enum_inquiries_inquiry_type";
  CREATE TYPE "public"."enum_inquiries_inquiry_type" AS ENUM('payment-terms', 'viewing', 'similar-units', 'property-information', 'general');
  ALTER TABLE "inquiries" ALTER COLUMN "inquiry_type" SET DEFAULT 'property-information'::"public"."enum_inquiries_inquiry_type";
  ALTER TABLE "inquiries" ALTER COLUMN "inquiry_type" SET DATA TYPE "public"."enum_inquiries_inquiry_type" USING "inquiry_type"::"public"."enum_inquiries_inquiry_type";
  UPDATE "properties" SET "status" = CASE lower(trim("status"))
    WHEN 'pre-selling' THEN 'pre-selling'
    WHEN 'under construction' THEN 'under-construction'
    WHEN 'ready for occupancy' THEN 'ready-for-occupancy'
    WHEN 'ready for turnover' THEN 'ready-for-occupancy'
    WHEN 'sold out' THEN 'sold-out'
    ELSE NULL
  END;
  ALTER TABLE "properties" ALTER COLUMN "status" SET DATA TYPE "public"."enum_properties_status" USING "status"::"public"."enum_properties_status";
  ALTER TABLE "properties" ADD COLUMN "reservation_fee" varchar;
  ALTER TABLE "properties" ADD COLUMN "target_turnover" varchar;
  ALTER TABLE "properties" ADD COLUMN "terms_as_of" timestamp(3) with time zone;
  ALTER TABLE "properties" ADD COLUMN "location" varchar;
  ALTER TABLE "properties" ADD COLUMN "map_url" varchar;
  ALTER TABLE "properties" ADD COLUMN "dhsud_lts_number" varchar;
  ALTER TABLE "inquiries" ADD COLUMN "preferred_channel" "enum_inquiries_preferred_channel";
  ALTER TABLE "inquiries" ADD COLUMN "visit_mode" "enum_inquiries_visit_mode";
  ALTER TABLE "inquiries" ADD COLUMN "preferred_date" timestamp(3) with time zone;
  ALTER TABLE "inquiries" ADD COLUMN "buyer_location" varchar;
  ALTER TABLE "inquiries" ADD COLUMN "is_abroad" boolean DEFAULT false;
  ALTER TABLE "inquiries" ADD COLUMN "best_time_to_reach" varchar;
  ALTER TABLE "inquiries" ADD COLUMN "privacy_consent" boolean DEFAULT false;
  ALTER TABLE "inquiries" ADD COLUMN "privacy_consent_at" timestamp(3) with time zone;
  ALTER TABLE "testimonials" ADD COLUMN "consent_on_file" boolean DEFAULT false;
  ALTER TABLE "profile" ADD COLUMN "mobile_e164" varchar;
  ALTER TABLE "profile" ADD COLUMN "viber_enabled" boolean DEFAULT false;
  ALTER TABLE "profile" ADD COLUMN "whatsapp_enabled" boolean DEFAULT false;
  ALTER TABLE "profile" ADD COLUMN "messenger_username" varchar;
  ALTER TABLE "profile" ADD COLUMN "response_hours" varchar;
  ALTER TABLE "profile" ADD COLUMN "prc_accreditation_no" varchar;
  ALTER TABLE "profile" ADD COLUMN "prc_valid_until" timestamp(3) with time zone;
  ALTER TABLE "profile" ADD COLUMN "supervising_broker_name" varchar;
  ALTER TABLE "profile" ADD COLUMN "supervising_broker_prc_no" varchar;
  ALTER TABLE "properties_payment_schemes" ADD CONSTRAINT "properties_payment_schemes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_unit_types" ADD CONSTRAINT "properties_unit_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "properties_payment_schemes_order_idx" ON "properties_payment_schemes" USING btree ("_order");
  CREATE INDEX "properties_payment_schemes_parent_id_idx" ON "properties_payment_schemes" USING btree ("_parent_id");
  CREATE INDEX "properties_unit_types_order_idx" ON "properties_unit_types" USING btree ("_order");
  CREATE INDEX "properties_unit_types_parent_id_idx" ON "properties_unit_types" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "properties_payment_schemes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "properties_unit_types" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "properties_payment_schemes" CASCADE;
  DROP TABLE "properties_unit_types" CASCADE;
  ALTER TABLE "inquiries" ALTER COLUMN "inquiry_type" SET DATA TYPE text;
  ALTER TABLE "inquiries" ALTER COLUMN "inquiry_type" SET DEFAULT 'property-information'::text;
  UPDATE "inquiries" SET "inquiry_type" = CASE "inquiry_type"
    WHEN 'viewing' THEN 'schedule-viewing'
    WHEN 'similar-units' THEN 'general'
    ELSE "inquiry_type"
  END;
  DROP TYPE "public"."enum_inquiries_inquiry_type";
  CREATE TYPE "public"."enum_inquiries_inquiry_type" AS ENUM('property-information', 'schedule-viewing', 'payment-terms', 'general');
  ALTER TABLE "inquiries" ALTER COLUMN "inquiry_type" SET DEFAULT 'property-information'::"public"."enum_inquiries_inquiry_type";
  ALTER TABLE "inquiries" ALTER COLUMN "inquiry_type" SET DATA TYPE "public"."enum_inquiries_inquiry_type" USING "inquiry_type"::"public"."enum_inquiries_inquiry_type";
  ALTER TABLE "inquiries" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "inquiries" ALTER COLUMN "status" SET DEFAULT 'new'::text;
  UPDATE "inquiries" SET "status" = 'contacted' WHERE "status" IN ('scheduled', 'visited');
  DROP TYPE "public"."enum_inquiries_status";
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'contacted', 'closed');
  ALTER TABLE "inquiries" ALTER COLUMN "status" SET DEFAULT 'new'::"public"."enum_inquiries_status";
  ALTER TABLE "inquiries" ALTER COLUMN "status" SET DATA TYPE "public"."enum_inquiries_status" USING "status"::"public"."enum_inquiries_status";
  ALTER TABLE "properties" ALTER COLUMN "status" SET DATA TYPE varchar;
  ALTER TABLE "properties" DROP COLUMN "reservation_fee";
  ALTER TABLE "properties" DROP COLUMN "target_turnover";
  ALTER TABLE "properties" DROP COLUMN "terms_as_of";
  ALTER TABLE "properties" DROP COLUMN "location";
  ALTER TABLE "properties" DROP COLUMN "map_url";
  ALTER TABLE "properties" DROP COLUMN "dhsud_lts_number";
  ALTER TABLE "inquiries" DROP COLUMN "preferred_channel";
  ALTER TABLE "inquiries" DROP COLUMN "visit_mode";
  ALTER TABLE "inquiries" DROP COLUMN "preferred_date";
  ALTER TABLE "inquiries" DROP COLUMN "buyer_location";
  ALTER TABLE "inquiries" DROP COLUMN "is_abroad";
  ALTER TABLE "inquiries" DROP COLUMN "best_time_to_reach";
  ALTER TABLE "inquiries" DROP COLUMN "privacy_consent";
  ALTER TABLE "inquiries" DROP COLUMN "privacy_consent_at";
  ALTER TABLE "testimonials" DROP COLUMN "consent_on_file";
  ALTER TABLE "profile" DROP COLUMN "mobile_e164";
  ALTER TABLE "profile" DROP COLUMN "viber_enabled";
  ALTER TABLE "profile" DROP COLUMN "whatsapp_enabled";
  ALTER TABLE "profile" DROP COLUMN "messenger_username";
  ALTER TABLE "profile" DROP COLUMN "response_hours";
  ALTER TABLE "profile" DROP COLUMN "prc_accreditation_no";
  ALTER TABLE "profile" DROP COLUMN "prc_valid_until";
  ALTER TABLE "profile" DROP COLUMN "supervising_broker_name";
  ALTER TABLE "profile" DROP COLUMN "supervising_broker_prc_no";
  DROP TYPE "public"."enum_properties_payment_schemes_balance_mode";
  DROP TYPE "public"."enum_properties_status";
  DROP TYPE "public"."enum_inquiries_preferred_channel";
  DROP TYPE "public"."enum_inquiries_visit_mode";`)
}
