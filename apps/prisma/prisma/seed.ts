import { PrismaClient, UserRole, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.user.upsert({
    where: { email: "trejgun@gmail.com" },
    update: {},
    create: {
      firstName: "Trej",
      lastName: "Gun",
      email: "trejgun@gmail.com",
      password: "92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff", // My5up3r5tr0ngP@55w0rd
      roles: [UserRole.ADMIN],
      status: UserStatus.ACTIVE,
    },
  });
}

void main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: unknown) => {
    console.error(e);
    await prisma.$disconnect();
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  });
