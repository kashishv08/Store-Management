import { verifyToken } from "@/lib/service/jwt";
import { prismaClient } from "@/lib/service/prisma";
import { cookies } from "next/headers";
import { roleType } from "../../generated/prisma";

export type usertype = {
  id: string;
  email: string;
  name: string | null;
  username: string;
  role: roleType;
  avatar: string | null;
};

export const getUserFromCookie = async (): Promise<usertype | null> => {
  try {
    const cookie = await cookies();
    const token = cookie.get("newToken")?.value;
    if (!token) return null;
    const data = verifyToken(token);
    if (!data?.id) {
      return null;
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: data.id,
      },
      omit: {
        password: true,
      },
    });
    if (!user) return null;

    return user;
  } catch (e: any) {
    console.log(e);
    return null;
  }
};
