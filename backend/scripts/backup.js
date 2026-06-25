import fs from "fs";
import path from "path";
import "dotenv/config";
import prisma from "../src/config/db.js";

async function backup() {
  console.log("Iniciando backup de la base de datos...");
  try {
    const data = {
      User: await prisma.user.findMany(),
      Subject: await prisma.subject.findMany(),
      Schedule: await prisma.schedule.findMany(),
      Task: await prisma.task.findMany(),
      Reminder: await prisma.reminder.findMany(),
      Report: await prisma.report.findMany(),
      PasswordReset: await prisma.passwordReset.findMany(),
    };

    const dir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const file = path.join(dir, `backup-${timestamp}.json`);

    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`✅ Backup completado exitosamente en: ${file}`);
  } catch (error) {
    console.error("❌ Error al realizar el backup:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

backup();
