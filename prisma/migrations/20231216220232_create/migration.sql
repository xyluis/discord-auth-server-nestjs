-- CreateTable
CREATE TABLE "logins" (
    "id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "logins_id_key" ON "logins"("id");
