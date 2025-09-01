import { PrismaClient, Prisma } from "./generated-prisma-client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

const entities = ["user", "post"];
const actions = ["create", "read", "update", "delete"];
const accesses = ["own", "any"];

export async function main() {
  console.log("Deleting existing data ...");
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  console.log("Seeding started ...");
  for (const entity of entities) {
    for (const action of actions) {
      for (const access of accesses) {
        const permission = await prisma.permission.create({
          data: {
            entity,
            action,
            access,
          },
        });
        console.log(`Created permission with id: ${permission.id}`);
      }
    }
  }
  const adminRole = await prisma.role.create({
    data: {
      name: "admin",
      permissions: {
        connect: await prisma.permission.findMany({
          select: { id: true },
          where: { access: "any" },
        }),
      },
    },
  });
  console.log(`Created role with id: ${adminRole.id}`);
  const userRole = await prisma.role.create({
    data: {
      name: "user",
      permissions: {
        connect: await prisma.permission.findMany({
          select: { id: true },
          where: { access: "own" },
        }),
      },
    },
  });
  console.log(`Created role with id: ${userRole.id}`);
  console.log("Seeding finished.");
}

main().catch((e) => {
  console.error("Error during seeding:");
  console.error(e);
  process.exit(1);
});
