import { PrismaClient } from "../../../generated/prisma";

export const prismaClient = new PrismaClient({
  datasourceUrl: process.env.MONGODB_URL,
});