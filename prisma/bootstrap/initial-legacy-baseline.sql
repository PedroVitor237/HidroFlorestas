-- CreateSchema
-- Fresh-install legacy baseline derived from the IMP-002 schema at 7b71346.
-- Apply only to a verified empty database. It includes the SQL effect of the
-- first versioned migration (20260907120000_unique_laboratory_access_code),
-- which must then be marked applied before the remaining migrations deploy.

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'DEVELOPER', 'MODERATOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'BLOCKED');

-- CreateEnum
CREATE TYPE "LandType" AS ENUM ('FOREST', 'AGROFORESTRY', 'CROPLAND', 'PASTURE', 'DEGRADED_PASTURE', 'BARE_SOIL', 'URBAN', 'OTHERS');

-- CreateEnum
CREATE TYPE "IHFRClass" AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "LevelBasicDefault" AS ENUM ('LOW', 'MODERATE', 'HIGH');

-- CreateEnum
CREATE TYPE "WaterSourceType" AS ENUM ('RIVER_STREAM', 'SPRING', 'SHALLOW_WELL', 'TUBULA_WELL', 'CISTERN', 'OTHER');

-- CreateEnum
CREATE TYPE "WaterAvailability" AS ENUM ('PERMANENT', 'SEASONAL', 'SCARCE');

-- CreateEnum
CREATE TYPE "SalinityIndicator" AS ENUM ('NONE', 'SUSPERCTED', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "SoilTexture" AS ENUM ('SANDY', 'MEDIUM', 'CLAYEY');

-- CreateEnum
CREATE TYPE "ErosionSigns" AS ENUM ('NONE', 'LAMINAR', 'RILLS_GUILLIES');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "image" TEXT NOT NULL DEFAULT '',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coordinates" (
    "id" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,

    CONSTRAINT "Coordinates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaboratoryRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "imageBanner" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "accessCode" TEXT NOT NULL,

    CONSTRAINT "LaboratoryRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchersLinked" (
    "userId" TEXT NOT NULL,
    "laboratoryRoomId" TEXT NOT NULL,

    CONSTRAINT "ResearchersLinked_pkey" PRIMARY KEY ("userId","laboratoryRoomId")
);

-- CreateTable
CREATE TABLE "CollectionArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "laboratoryRoomId" TEXT NOT NULL,
    "coordinatesId" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "landType" "LandType" NOT NULL,
    "descriptionLandType" TEXT,

    CONSTRAINT "CollectionArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionData" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "collectionAreaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "observations" TEXT,

    CONSTRAINT "CollectionData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IHFRDiagnosis" (
    "id" TEXT NOT NULL,
    "collectionDataId" TEXT NOT NULL,
    "ihfrScore" DOUBLE PRECISION NOT NULL,
    "ihfrClass" "IHFRClass" NOT NULL,
    "waterScore" DOUBLE PRECISION NOT NULL,
    "soilScore" DOUBLE PRECISION NOT NULL,
    "vegetationScore" DOUBLE PRECISION NOT NULL,
    "territoryScore" DOUBLE PRECISION NOT NULL,
    "dataQuality" "LevelBasicDefault" NOT NULL,
    "algorithmVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "explanationAI" TEXT,

    CONSTRAINT "IHFRDiagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterData" (
    "id" TEXT NOT NULL,
    "collectionDataId" TEXT NOT NULL,
    "waterSourceType" "WaterSourceType" NOT NULL,
    "hasSpring" BOOLEAN NOT NULL,
    "wellDepth_m" DOUBLE PRECISION,
    "waterAvailability" "WaterAvailability" NOT NULL,
    "salinityIndicator" "SalinityIndicator",

    CONSTRAINT "WaterData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoilData" (
    "id" TEXT NOT NULL,
    "collectionDataId" TEXT NOT NULL,
    "soilTexture" "SoilTexture" NOT NULL,
    "infiltrationRate_mm_h" DOUBLE PRECISION NOT NULL,
    "compactionLevel" "LevelBasicDefault" NOT NULL,
    "erosionSigns" "ErosionSigns" NOT NULL,
    "soilExposedPercent" DOUBLE PRECISION,

    CONSTRAINT "SoilData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VegetationData" (
    "id" TEXT NOT NULL,
    "collectionDataId" TEXT NOT NULL,
    "vegetationCoverPercent" DOUBLE PRECISION NOT NULL,
    "fragmentationLevel" "LevelBasicDefault" NOT NULL,
    "hasRiparian_app" BOOLEAN,
    "landscapeDegradation" "LevelBasicDefault" NOT NULL,

    CONSTRAINT "VegetationData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TerrainData" (
    "id" TEXT NOT NULL,
    "collectionDataId" TEXT NOT NULL,
    "drainage_density" DOUBLE PRECISION,
    "elevation_m" DOUBLE PRECISION,
    "slopePercent" DOUBLE PRECISION,

    CONSTRAINT "TerrainData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LaboratoryRoom_accessCode_key" ON "LaboratoryRoom"("accessCode");

-- CreateIndex
CREATE UNIQUE INDEX "WaterData_collectionDataId_key" ON "WaterData"("collectionDataId");

-- CreateIndex
CREATE UNIQUE INDEX "SoilData_collectionDataId_key" ON "SoilData"("collectionDataId");

-- CreateIndex
CREATE UNIQUE INDEX "VegetationData_collectionDataId_key" ON "VegetationData"("collectionDataId");

-- CreateIndex
CREATE UNIQUE INDEX "TerrainData_collectionDataId_key" ON "TerrainData"("collectionDataId");

-- AddForeignKey
ALTER TABLE "LaboratoryRoom" ADD CONSTRAINT "LaboratoryRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchersLinked" ADD CONSTRAINT "ResearchersLinked_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchersLinked" ADD CONSTRAINT "ResearchersLinked_laboratoryRoomId_fkey" FOREIGN KEY ("laboratoryRoomId") REFERENCES "LaboratoryRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionArea" ADD CONSTRAINT "CollectionArea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionArea" ADD CONSTRAINT "CollectionArea_coordinatesId_fkey" FOREIGN KEY ("coordinatesId") REFERENCES "Coordinates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionArea" ADD CONSTRAINT "CollectionArea_laboratoryRoomId_fkey" FOREIGN KEY ("laboratoryRoomId") REFERENCES "LaboratoryRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionData" ADD CONSTRAINT "CollectionData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionData" ADD CONSTRAINT "CollectionData_collectionAreaId_fkey" FOREIGN KEY ("collectionAreaId") REFERENCES "CollectionArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IHFRDiagnosis" ADD CONSTRAINT "IHFRDiagnosis_collectionDataId_fkey" FOREIGN KEY ("collectionDataId") REFERENCES "CollectionData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterData" ADD CONSTRAINT "WaterData_collectionDataId_fkey" FOREIGN KEY ("collectionDataId") REFERENCES "CollectionData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoilData" ADD CONSTRAINT "SoilData_collectionDataId_fkey" FOREIGN KEY ("collectionDataId") REFERENCES "CollectionData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VegetationData" ADD CONSTRAINT "VegetationData_collectionDataId_fkey" FOREIGN KEY ("collectionDataId") REFERENCES "CollectionData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TerrainData" ADD CONSTRAINT "TerrainData_collectionDataId_fkey" FOREIGN KEY ("collectionDataId") REFERENCES "CollectionData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
