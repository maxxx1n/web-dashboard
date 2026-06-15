import 'dotenv/config';
import prisma from './src/config/db.js';

async function main() {
  const users = await prisma.user.findMany({ orderBy: { id: 'asc' } });
  if (users.length > 0) {
    await prisma.user.updateMany({
      data: { role: 'Usuario' }
    });
    const firstUser = users[0];
    await prisma.user.update({
      where: { id: firstUser.id },
      data: { role: 'Administrador' }
    });
    console.log(`Usuario ${firstUser.email} es ahora Administrador exclusivo.`);
  } else {
    console.log("No hay usuarios en la BD todavía.");
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
