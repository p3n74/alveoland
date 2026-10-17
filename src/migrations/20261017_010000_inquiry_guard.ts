import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "inquiry_guard" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" varchar(8) NOT NULL CHECK ("kind" IN ('ip', 'email', 'phone')),
  	"key_hash" varchar(64) NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE INDEX IF NOT EXISTS "inquiry_guard_lookup_idx" ON "inquiry_guard" USING btree ("kind", "key_hash", "created_at");
  CREATE INDEX IF NOT EXISTS "inquiry_guard_created_at_idx" ON "inquiry_guard" USING btree ("created_at");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "inquiry_guard";`)
}
