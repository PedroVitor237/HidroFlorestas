BEGIN;
LOCK TABLE "LaboratoryRoom", "ResearchersLinked", "CollectionArea", "Coordinates" IN ACCESS EXCLUSIVE MODE;
-- Fail before changing legacy data. Messages deliberately contain no records.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Coordinates" WHERE trim(latitude) !~ '^[+-]?([0-9]+(\.[0-9]*)?|\.[0-9]+)([eE][+-]?[0-9]+)?$'
    OR trim(longitude) !~ '^[+-]?([0-9]+(\.[0-9]*)?|\.[0-9]+)([eE][+-]?[0-9]+)?$') THEN
    RAISE EXCEPTION 'IMP003_INVALID_COORDINATES';
  END IF;
  IF EXISTS (SELECT 1 FROM "Coordinates" WHERE latitude::numeric NOT BETWEEN -90 AND 90 OR longitude::numeric NOT BETWEEN -180 AND 180) THEN
    RAISE EXCEPTION 'IMP003_COORDINATE_RANGE';
  END IF;
  IF EXISTS (SELECT c.id FROM "Coordinates" c LEFT JOIN "CollectionArea" a ON a."coordinatesId"=c.id GROUP BY c.id HAVING count(a.id)<>1) OR
     EXISTS (SELECT 1 FROM "CollectionArea" a LEFT JOIN "Coordinates" c ON c.id=a."coordinatesId" WHERE c.id IS NULL) THEN
    RAISE EXCEPTION 'IMP003_COORDINATE_REFERENCES';
  END IF;
  IF EXISTS (SELECT 1 FROM "LaboratoryRoom" l LEFT JOIN "User" u ON u.id=l."userId" WHERE u.id IS NULL) THEN
    RAISE EXCEPTION 'IMP003_INVALID_CREATOR';
  END IF;
  IF EXISTS (SELECT "userId" FROM (SELECT "userId","laboratoryRoomId" FROM "ResearchersLinked" UNION SELECT "userId",id FROM "LaboratoryRoom") links GROUP BY "userId" HAVING count(*)>5) THEN
    RAISE EXCEPTION 'IMP003_MEMBERSHIP_LIMIT';
  END IF;
END $$;
CREATE TYPE "LaboratoryMembershipRole" AS ENUM ('OWNER','ADMIN','MEMBER');
ALTER TABLE "ResearchersLinked" ADD COLUMN id TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  ADD COLUMN role "LaboratoryMembershipRole" NOT NULL DEFAULT 'MEMBER';
INSERT INTO "ResearchersLinked" ("userId","laboratoryRoomId")
  SELECT "userId",id FROM "LaboratoryRoom" ON CONFLICT ("userId","laboratoryRoomId") DO NOTHING;
UPDATE "ResearchersLinked" r SET role='OWNER' FROM "LaboratoryRoom" l WHERE r."laboratoryRoomId"=l.id AND r."userId"=l."userId";
CREATE UNIQUE INDEX "ResearchersLinked_id_key" ON "ResearchersLinked"(id);
CREATE INDEX "ResearchersLinked_laboratoryRoomId_role_idx" ON "ResearchersLinked"("laboratoryRoomId",role);
CREATE UNIQUE INDEX "ResearchersLinked_one_owner" ON "ResearchersLinked"("laboratoryRoomId") WHERE role='OWNER';

CREATE FUNCTION imp003_check_owner() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE target_id TEXT; old_id TEXT;
BEGIN
  IF TG_TABLE_NAME='LaboratoryRoom' THEN
    IF TG_OP<>'DELETE' THEN target_id:=NEW.id; END IF;
    IF TG_OP<>'INSERT' THEN old_id:=OLD.id; END IF;
  ELSE
    IF TG_OP<>'DELETE' THEN target_id:=NEW."laboratoryRoomId"; END IF;
    IF TG_OP<>'INSERT' THEN old_id:=OLD."laboratoryRoomId"; END IF;
  END IF;
  IF EXISTS (
    SELECT 1 FROM "LaboratoryRoom" l WHERE l.id IN (target_id,old_id) AND
      (SELECT count(*) FROM "ResearchersLinked" r WHERE r."laboratoryRoomId"=l.id AND r.role='OWNER' AND r."userId"=l."userId")<>1
  ) THEN RAISE EXCEPTION 'IMP003_OWNER_INVARIANT'; END IF;
  RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER imp003_membership_owner AFTER INSERT OR UPDATE OR DELETE ON "ResearchersLinked"
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION imp003_check_owner();
CREATE CONSTRAINT TRIGGER imp003_laboratory_owner AFTER INSERT OR UPDATE OR DELETE ON "LaboratoryRoom"
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION imp003_check_owner();

ALTER TABLE "CollectionArea" ADD COLUMN latitude DECIMAL(8,6), ADD COLUMN longitude DECIMAL(9,6);
UPDATE "CollectionArea" a SET latitude=round(c.latitude::numeric,6), longitude=round(c.longitude::numeric,6)
 FROM "Coordinates" c WHERE c.id=a."coordinatesId";
DO $$
BEGIN
 IF EXISTS (SELECT 1 FROM "CollectionArea" a JOIN "Coordinates" c ON c.id=a."coordinatesId" WHERE
   a.latitude IS NULL OR a.longitude IS NULL OR abs(a.latitude-c.latitude::numeric)>0.0000005 OR abs(a.longitude-c.longitude::numeric)>0.0000005) THEN
   RAISE EXCEPTION 'IMP003_COORDINATE_BACKFILL';
 END IF;
END $$;
ALTER TABLE "CollectionArea" ALTER COLUMN latitude SET NOT NULL, ALTER COLUMN longitude SET NOT NULL,
 ADD CONSTRAINT "CollectionArea_latitude_range" CHECK (latitude BETWEEN -90 AND 90),
 ADD CONSTRAINT "CollectionArea_longitude_range" CHECK (longitude BETWEEN -180 AND 180),
 ALTER COLUMN municipality DROP NOT NULL, ALTER COLUMN state DROP NOT NULL,
 ALTER COLUMN cep DROP NOT NULL, ALTER COLUMN "landType" TYPE TEXT USING "landType"::text,
 ALTER COLUMN "landType" DROP NOT NULL;
CREATE INDEX "CollectionArea_laboratoryRoomId_createdAt_idx" ON "CollectionArea"("laboratoryRoomId","createdAt");
ALTER TABLE "CollectionArea" DROP COLUMN "coordinatesId";
DROP TABLE "Coordinates";
COMMIT;
