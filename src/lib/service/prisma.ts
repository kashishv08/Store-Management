import "dotenv/config";
import { PrismaClient } from "../../../generated/prisma"

export const prismaClient = new PrismaClient();
