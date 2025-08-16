import { getUserFromCookie } from "@/lib/helper";
import { generateToken } from "@/lib/service/jwt";
import { prismaClient } from "@/lib/service/prisma";
import { cookies } from "next/headers";
import { roleType } from "../../../../../generated/prisma";

export const loginUser = async (
  _: any,
  args: {
    userCred: string;
    password: string;
  }
) => {
  const cookie = await cookies();

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        OR: [
          {
            username: args.userCred,
          },
          {
            email: args.userCred,
          },
        ],
      },
    });
    if (!user) {
      return false;
    }
    if (user.password == args.password) {
      const token = generateToken({
        id: user.id,
      });

      cookie.set("newToken", token);

      return true;
    } else {
      return false;
    }
  } catch (e: any) {
    console.log(e.message);
    return false;
  }
};

export const createUser = async (
  _: any,
  args: {
    name: string;
    username: string;
    email: string;
    password: string;
    role: roleType;
  }
) => {
  try {
    const userFromCookie = await getUserFromCookie();
    if (!userFromCookie) return null;

    if (userFromCookie.role != "admin") return null;
    const user = await prismaClient.user.create({
      data: args,
    });
    return user;
  } catch (e: any) {
    console.log(e.message);
    return null;
  }
};

export const updateUserByAdmin = async (
  _: any,
  args: {
    userId: string;
    role: roleType;
    name: string;
    username: string;
    password: string;
    email: string;
  }
) => {
  try {
    const userFromCookie = await getUserFromCookie();
    if (!userFromCookie) return false;

    if (userFromCookie.role !== "admin") return false;
    const updatedUserRole = await prismaClient.user.update({
      where: {
        id: args.userId,
      },
      data: {
        role: args.role,
        name: args.name,
        username: args.username,
        password: args.password,
        email: args.email,
      },
    });
    return true;
  } catch (e: any) {
    console.log(e);
    return false;
  }
};

export const RemoveMember = async (
  _: any,
  args: {
    userId: string;
  }
) => {
  try {
    const userFromCookie = await getUserFromCookie();
    if (!userFromCookie) return false;

    if (userFromCookie.role !== "admin") return false;
    const isUser = await prismaClient.user.findUnique({
      where: {
        id: args.userId,
      },
    });

    if (isUser) {
      const updatedUserRole = await prismaClient.user.delete({
        where: {
          id: args.userId,
        },
      });
      return true;
    } else return false;
  } catch (e: any) {
    console.log(e);
    return false;
  }
};

export const updateProfile = async (
  _: any,
  args: {
    name: string;
    username: string;
    email: string;
    userId: string;
    avatar: string;
  }
) => {
  try {
    const userFromCookie = await getUserFromCookie();
    if (!userFromCookie) return null;

    const updatedProfile = await prismaClient.user.update({
      where: {
        id: args.userId,
      },
      data: {
        name: args.name,
        email: args.email,
        username: args.username,
        avatar: args.avatar,
      },
    });
    return true;
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
};

export const getAllUser = async () => {
  try {
    const user = await prismaClient.user.findMany({
      where: {
        role: {
          not: "admin",
        },
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

export const logout = async (
  _: any,
  args: {
    id: string;
  }
) => {
  const cookie = await cookies();
  const currUser = await getUserFromCookie();
  if (!currUser) return false;

  if (currUser.id !== args.id) return false;
  cookie.delete("newToken");
  return true;
};

export const filterUser = async (
  _: any,
  args: {
    input: string;
    role: "staff" | "manager";
  }
) => {
  const user = await prismaClient.user.findMany({
    where: {
      role: args.role ? args.role : { not: "admin" },
      name: {
        contains: args.input,
        mode: "insensitive",
      },
    },
  });
  return user;
};
