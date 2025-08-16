import { prismaClient } from "@/lib/service/prisma";
import { ProdCategory } from "../../../../../generated/prisma";
import { getUserFromCookie } from "@/lib/helper";

export const addProduct = async (
  _: any,
  args: {
    title: string;
    description: string;
    imageUrl: string;
    category: ProdCategory;
    price: number;
    stock: number;
  }
) => {
  try {
    const createdProd = await prismaClient.product.create({
      data: args,
    });
    return createdProd;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const editProduct = async (
  _: any,
  args: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: ProdCategory;
    price: number;
    stock: number;
  }
) => {
  const currUser = await getUserFromCookie();
  if (!currUser) return false;

  if (currUser.role == "staff") return false;
  try {
    const editProd = await prismaClient.product.update({
      where: {
        id: args.id,
      },
      data: {
        title: args.title,
        description: args.description,
        imageUrl: args.imageUrl,
        category: args.category,
        price: args.price,
        stock: args.stock,
      },
    });
    return true;
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
};

export const deleteProduct = async (
  _: any,
  args: {
    id: string;
  }
) => {
  const currUser = await getUserFromCookie();
  if (!currUser) return false;

  if (currUser.role == "staff") return false;
  try {
    const delSale = await prismaClient.sale.deleteMany({
      where: {
        productId: args.id,
      },
    });
    const delProd = await prismaClient.product.delete({
      where: {
        id: args.id,
      },
    });
    return true;
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
};

export const getAllProd = async () => {
  try {
    const prod = await prismaClient.product.findMany({});
    return prod;
  } catch (e: any) {
    console.log(e.message);
  }
};

export const getProdById = async (_: any, args: { id: string }) => {
  const id = args.id;
  const prod = await prismaClient.product.findUnique({
    where: {
      id: id,
    },
    include: {
      Sale: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return prod;
};

export const createSale = async (
  _: any,
  args: {
    id: string;
    quantity: number;
  }
) => {
  try {
    const sale = await prismaClient.sale.create({
      data: {
        productId: args.id,
        quantity: args.quantity,
      },
    });
    if (sale) {
      await prismaClient.product.update({
        where: {
          id: args.id,
        },
        data: {
          stock: {
            decrement: args.quantity,
          },
        },
      });
    }
    return true;
  } catch (e: any) {
    console.log(e.message);
    return false;
  }
};

export const filterProd = async (
  _: any,
  args: {
    category: ProdCategory;
    orderBy: "asc" | "desc";
    input: string;
  }
) => {
  const prod = await prismaClient.product.findMany({
    where: {
      ...(args.category && { category: args.category }),
      title: {
        contains: args.input,
        mode: "insensitive",
      },
    },
    orderBy: {
      price: args.orderBy,
    },
  });
  return prod;
};
