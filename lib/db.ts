import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-unused-vars
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  // log: ["query"], // Uncomment to see SQL queries in the console
});

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

