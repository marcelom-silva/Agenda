import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient | undefined;
}

// Configuração para garantir que o Prisma funcione em todos os ambientes
const prismaClientSingleton = () => {
  // Em produção (Vercel), definimos explicitamente a URL para o SQLite
  const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
  
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    // log: ["query"], // Uncomment to see SQL queries in the console
  });
};

export const prisma = global.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
