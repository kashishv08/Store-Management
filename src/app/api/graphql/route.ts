import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import {
  createUser,
  filterUser,
  getAllUser,
  loginUser,
  logout,
  RemoveMember,
  updateProfile,
  updateUserByAdmin,
} from "./resolver/user";
import { typeDefs } from "./typeDef";
import { getUserFromCookie } from "@/lib/helper";
import {
  addProduct,
  createSale,
  deleteProduct,
  editProduct,
  filterProd,
  getAllProd,
  getProdById,
} from "./resolver/product";

const resolvers = {
  Query: {
    currUser: getUserFromCookie,
    getAllUser,
    getAllProd,
    filterProd,
    getProdById,
    filterUser,
  },

  Mutation: {
    loginUser,
    createUser,
    updateUserByAdmin,
    updateProfile,
    addProduct,
    editProduct,
    createSale,
    RemoveMember,
    deleteProduct,
    logout,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

export { handler as GET, handler as POST };
