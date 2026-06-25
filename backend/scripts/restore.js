import fs from "fs";
import path from "path";
import "dotenv/config";
import prisma from "../src/config/db.js";

async function restore() {
  const dir = path.join(process.cwd(), "backups");
  if (!fs.existsSync(dir)) {
    console.error("❌ No existe el directorio de backups.");
    process.exit(1);
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.error("❌ No se encontraron archivos de backup.");
    process.exit(1);
  }

  // Tomar el más reciente por orden alfabético de la fecha
  files.sort();
  const file = path.join(dir, files[files.length - 1]);
  console.log(
    `Iniciando restauración desde el backup más reciente: ${files[files.length - 1]}...`,
  );

  const data = JSON.parse(fs.readFileSync(file, "utf-8"));

  try {
    // 1. Borrar tablas existentes (en orden inverso de dependencias o usando cascada)
    console.log("Limpiando base de datos...");
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE users, subjects, schedules, tasks, reminders, reports, password_resets RESTART IDENTITY CASCADE;`,
    );

    // 2. Restaurar data
    console.log("Insertando datos...");

    if (data.User?.length) await prisma.user.createMany({ data: data.User });
    if (data.Subject?.length)
      await prisma.subject.createMany({ data: data.Subject });
    if (data.Schedule?.length)
      await prisma.schedule.createMany({ data: data.Schedule });
    if (data.Task?.length) await prisma.task.createMany({ data: data.Task });
    if (data.Reminder?.length)
      await prisma.reminder.createMany({ data: data.Reminder });
    if (data.Report?.length)
      await prisma.report.createMany({ data: data.Report });
    if (data.PasswordReset?.length)
      await prisma.passwordReset.createMany({ data: data.PasswordReset });

    // 3. Resincronizar las secuencias (autoincrement) de PostgreSQL para que los próximos inserts no den error
    console.log("Sincronizando secuencias de PostgreSQL...");
    const tables = [
      "users",
      "subjects",
      "schedules",
      "tasks",
      "reminders",
      "reports",
      "password_resets",
    ];
    for (const table of tables) {
      await prisma.$executeRawUnsafe(`
        SELECT setval(pg_get_serial_sequence('${table}', 'id'), coalesce(max(id),0) + 1, false) FROM ${table};
      `);
    }

    console.log("✅ Restauración completada exitosamente.");
  } catch (error) {
    console.error("❌ Error al restaurar el backup:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

restore();
