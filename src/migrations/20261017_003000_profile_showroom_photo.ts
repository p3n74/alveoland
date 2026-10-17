import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "profile" ADD COLUMN "showroom_photo_id" integer;
  ALTER TABLE "profile" ADD CONSTRAINT "profile_showroom_photo_id_media_id_fk" FOREIGN KEY ("showroom_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "profile_showroom_photo_idx" ON "profile" USING btree ("showroom_photo_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "profile" DROP CONSTRAINT "profile_showroom_photo_id_media_id_fk";
  DROP INDEX "profile_showroom_photo_idx";
  ALTER TABLE "profile" DROP COLUMN "showroom_photo_id";`)
}
