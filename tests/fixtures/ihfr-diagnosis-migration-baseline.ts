import type { PoolClient } from "pg";

export async function insertIHFRLegacyBaseline(client: PoolClient) {
  await client.query(`
    INSERT INTO "User" (id,email,"firstName","lastName",password,role,image,status,"createdAt","updatedAt","isAdmin")
    VALUES ('00000000-0000-4000-8000-000000000601','legacy-imp006@hidroflorestas.invalid','Legacy','IMP006','not-a-real-password','USER','','ACTIVE',now(),now(),false);
    INSERT INTO "LaboratoryRoom" (id,name,"createdAt","updatedAt","userId","imageBanner","isActive","accessCode")
    VALUES ('00000000-0000-4000-8000-000000000611','IMP-006 legacy baseline',now(),now(),'00000000-0000-4000-8000-000000000601','',true,'imp006-legacy-baseline');
    INSERT INTO "ResearchersLinked" ("userId","laboratoryRoomId",role)
    VALUES ('00000000-0000-4000-8000-000000000601','00000000-0000-4000-8000-000000000611','OWNER');
    INSERT INTO "CollectionArea" (id,name,"createdAt","updatedAt","isActive","userId","laboratoryRoomId",latitude,longitude)
    VALUES ('00000000-0000-4000-8000-000000000621','IMP-006 legacy area',now(),now(),true,'00000000-0000-4000-8000-000000000601','00000000-0000-4000-8000-000000000611',-3,-44);
    INSERT INTO "CollectionData" (id,"createdAt","updatedAt","collectionAreaId","laboratoryRoomId","userId","occurredAt","occurrenceOffset","confirmedAt","confirmationKey")
    VALUES ('00000000-0000-4000-8000-000000000631',now(),now(),'00000000-0000-4000-8000-000000000621','00000000-0000-4000-8000-000000000611','00000000-0000-4000-8000-000000000601',now(),'-03:00',now(),'00000000-0000-4000-8000-000000000632');
    INSERT INTO "IHFRDiagnosis" (id,"collectionDataId","ihfrScore","ihfrClass","waterScore","soilScore","vegetationScore","territoryScore","dataQuality","algorithmVersion")
    VALUES ('00000000-0000-4000-8000-000000000641','00000000-0000-4000-8000-000000000631',0.5,'MODERATE',0.5,0.5,0.5,0.5,'MODERATE','1.0.0');
  `);
}
