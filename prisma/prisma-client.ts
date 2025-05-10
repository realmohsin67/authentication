import { PrismaClient } from "./generated-prisma-client";
import { withAccelerate } from "@prisma/extension-accelerate";

const extendedPrismaClient = new PrismaClient().$extends(withAccelerate());

const globalForPrisma = global as typeof globalThis & {
  prisma: typeof extendedPrismaClient;
};

const prisma = globalForPrisma.prisma ?? extendedPrismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
