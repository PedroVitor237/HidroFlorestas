import type { PoolClient } from "@neondatabase/serverless";

const id = (suffix: number) => `60000000-0000-4000-8000-${String(suffix).padStart(12, "0")}`;

export const IHFR_ACTORS = {
  owner: id(1),
  contextualAdmin: id(2),
  member: id(3),
  outsider: id(4),
  inactive: id(5),
  revoked: id(6),
} as const;

export const IHFR_LABORATORIES = {
  active: id(11),
  inactive: id(12),
} as const;

export async function insertIHFRActorFixtures(client: PoolClient) {
  await client.query(
    `INSERT INTO "User" (id,email,"firstName","lastName",password,role,image,status,"createdAt","updatedAt") VALUES
      ($1,'owner@imp006.test.invalid','Owner','IMP006','fixture','USER','','ACTIVE',now(),now()),
      ($2,'admin@imp006.test.invalid','Contextual','Admin','fixture','USER','','ACTIVE',now(),now()),
      ($3,'member@imp006.test.invalid','Member','IMP006','fixture','USER','','ACTIVE',now(),now()),
      ($4,'outsider@imp006.test.invalid','Outsider','IMP006','fixture','USER','','ACTIVE',now(),now()),
      ($5,'inactive@imp006.test.invalid','Inactive','IMP006','fixture','USER','','INACTIVE',now(),now()),
      ($6,'revoked@imp006.test.invalid','Revoked','IMP006','fixture','USER','','ACTIVE',now(),now())`,
    Object.values(IHFR_ACTORS),
  );
  await client.query(
    `INSERT INTO "LaboratoryRoom" (id,name,"userId","isActive","accessCode","createdAt","updatedAt") VALUES
      ($1,'IMP-006 active laboratory',$3,true,'imp006-active',now(),now()),
      ($2,'IMP-006 inactive laboratory',$3,false,'imp006-inactive',now(),now())`,
    [IHFR_LABORATORIES.active, IHFR_LABORATORIES.inactive, IHFR_ACTORS.owner],
  );
  await client.query(
    `INSERT INTO "ResearchersLinked" (id,role,"userId","laboratoryRoomId") VALUES
      ($1,'OWNER',$2,$5),($3,'ADMIN',$4,$5),($6,'MEMBER',$7,$5),
      ($8,'OWNER',$2,$9),($10,'ADMIN',$4,$9),($11,'MEMBER',$7,$9)`,
    [
      id(21), IHFR_ACTORS.owner, id(22), IHFR_ACTORS.contextualAdmin,
      IHFR_LABORATORIES.active, id(23), IHFR_ACTORS.member, id(24),
      IHFR_LABORATORIES.inactive, id(25), id(26),
    ],
  );
  // outsider and revoked deliberately have no current membership.
}
