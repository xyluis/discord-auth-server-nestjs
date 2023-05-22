-- CreateTable
CREATE TABLE "Login" (
    "id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Login_id_key" ON "Login"("id");
