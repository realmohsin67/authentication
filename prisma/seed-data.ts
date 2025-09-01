import { createPassword } from "@/utils/createPassword";
import { PrismaClient, Prisma } from "./generated-prisma-client";
import { withAccelerate } from "@prisma/extension-accelerate";
import log from "@/utils/consoleLogger";

const prisma = new PrismaClient().$extends(withAccelerate());

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@prisma.io",
    password: {
      create: {
        hash: createPassword("alice"),
      },
    },
    roles: { connect: [{ name: "admin" }, { name: "user" }] },
    posts: {
      create: [
        {
          title: "Alice Post 1",
          content: "https://pris.ly/discord",
          published: true,
        },
        {
          title: "Alice Post 2",
          content: "https://pris.ly/youtube",
        },
        {
          title: "Alice Post 3",
          content: "https://pris.ly/youtube",
        },
        {
          title: "Alice Post 4",
          content: "https://pris.ly/youtube",
        },
        {
          title: "Alice Post 5",
          content: "https://pris.ly/youtube",
        },
      ],
    },
  },
  {
    name: "Bob",
    email: "bob@prisma.io",
    password: {
      create: {
        hash: createPassword("bob"),
      },
    },
    roles: { connect: [{ name: "user" }] },
    posts: {
      create: [
        {
          title: "Bob Post 1",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
        {
          title: "Bob Post 2",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
        {
          title: "Bob Post 3",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
        {
          title: "Bob Post 4",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
      ],
    },
  },
  {
    name: "Sam",
    email: "sam@prisma.io",
    password: {
      create: {
        hash: createPassword("sam"),
      },
    },
    roles: { connect: [{ name: "user" }] },
    posts: {
      create: [
        {
          title: "Sam Post 1",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
        {
          title: "Sam Post 2",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
        {
          title: "Sam Post 3",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
      ],
    },
  },
  {
    name: "Jasmine",
    email: "jasmine@prisma.io",
    password: {
      create: {
        hash: createPassword("jasmine"),
      },
    },
    roles: { connect: [{ name: "user" }] },
    posts: {
      create: [
        {
          title: "Jasmine Post 1",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
        {
          title: "Jasmine Post 2",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
        {
          title: "Jasmine Post 3",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
        {
          title: "Jasmine Post 4",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
        {
          title: "Jasmine Post 5",
          content: "https://www.twitter.com/prisma",
          published: false,
        },
        {
          title: "Jasmine Post 6",
          content: "https://www.twitter.com/prisma",
          published: false,
        },
        {
          title: "Jasmine Post 7",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
        {
          title: "Jasmine Post 8",
          content: "https://www.twitter.com/prisma",
          published: false,
        },
      ],
    },
  },
  {
    name: "Real",
    email: "real@prisma.io",
    password: {
      create: {
        hash: createPassword("real"),
      },
    },
    roles: { connect: [{ name: "admin" }, { name: "user" }] },
    posts: {
      create: [
        {
          title: "Real Post 1",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
        {
          title: "Real Post 2",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
        {
          title: "Real Post 3",
          content: "https://www.twitter.com/prisma",
          published: true,
        },
      ],
    },
  },
];

export async function main() {
  log.info(`Deleting existing data...`);
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  await prisma.password.deleteMany();
  log.success("Existing data deleted.");
  log.info("Seeding new data...");
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    log.success(`Created user with id: ${user.id}`);
  }
  log.success(`Seeding completed.`);
}

main().catch((e) => {
  console.error(`Error during seeding:`);
  log.error(`Error during seeding: `, e);
  process.exit(1);
});
