-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "trigram" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#2E75B6',
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "fte" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "countsInCapacity" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'active',
    "activeFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activeTo" TIMESTAMP(3),

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sprint" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "quarter" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "sprintGoal" TEXT,
    "capacityDays" DOUBLE PRECISION,
    "pctBau" DOUBLE PRECISION NOT NULL DEFAULT 0.30,
    "teamMood" INTEGER,

    CONSTRAINT "Sprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SprintItem" (
    "id" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "jiraKey" TEXT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "storyPoints" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'todo',
    "isAdded" BOOLEAN NOT NULL DEFAULT false,
    "isRemoved" BOOLEAN NOT NULL DEFAULT false,
    "addedDay" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SprintItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BurndownEntry" (
    "id" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "remainingSp" INTEGER,
    "doneSp" INTEGER,
    "addedSp" INTEGER NOT NULL DEFAULT 0,
    "removedSp" INTEGER NOT NULL DEFAULT 0,
    "scopeTotal" INTEGER,

    CONSTRAINT "BurndownEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Absence" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "daysCount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Absence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_slug_key" ON "Team"("slug");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprintItem" ADD CONSTRAINT "SprintItem_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BurndownEntry" ADD CONSTRAINT "BurndownEntry_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "Absence_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "Absence_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
