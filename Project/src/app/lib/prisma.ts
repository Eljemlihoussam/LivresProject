import { PrismaClient } from "@prisma/client";

const Globalprisma = global as unknown as { prisma: PrismaClient | undefined };
export const prisma = Globalprisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") {
    Globalprisma.prisma = prisma ;
}
