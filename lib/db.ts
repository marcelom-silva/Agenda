// lib/db.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  // log: ["query"], // Uncomment to see SQL queries in the console
  datasources: {
    db: {
      // Forçar a URL de conexão com codificação adequada dos caracteres especiais
      url: process.env.DATABASE_URL?.replace(
        /%(?![0-9A-Fa-f]{2})/g,
        '%25'
      ).replace(
        /&(?!amp;|lt;|gt;|quot;|#39;)/g,
        '%26'
      )
    },
  },
});

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
