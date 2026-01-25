import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient({
    datasourceUrl: process.env.MONGODB_URL,
});
