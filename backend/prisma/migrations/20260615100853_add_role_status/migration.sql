-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Usuario',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Activo';
