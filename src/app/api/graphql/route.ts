import { ApolloServer } from "@apollo/server";
// import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest, NextResponse } from "next/server";
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

const allowedOrigins = [
  "http://localhost:3000",
  "https://studio.apollographql.com",
  "https://store-management-pink-one.vercel.app"
];

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

function buildHeaders(origin: string) {
  const headers: Record<string, string> = {};

  if (
    allowedOrigins.includes(origin) ||
    (origin.startsWith("https://store-management-") &&
      origin.endsWith(".vercel.app"))
  ) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS";
  headers["Access-Control-Allow-Headers"] =
    "Content-Type, Authorization";

  return headers;
}



let serverStarted = false;
async function startServer() {
  if (!serverStarted) {
    await server.start();
    serverStarted = true;
  }
}

/* ---------- OPTIONS (CORS preflight) ---------- */
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  return new NextResponse(null, {
    status: 204,
    headers: buildHeaders(origin),
  });
}

/* ---------- POST (GraphQL requests) ---------- */
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const headers = buildHeaders(origin);

  try {
    await startServer();

    const body = await req.json();
    const result = await server.executeOperation(
      {
        query: body.query,
        variables: body.variables,
        operationName: body.operationName,
      },
      {
        contextValue: { req },
      }
    );

    const payload =
      result.body.kind === "single"
        ? result.body.singleResult
        : result.body;

    return NextResponse.json(payload, { headers });
  } catch (err: any) {
    return NextResponse.json(
      { errors: [{ message: err.message }] },
      { status: 500, headers }
    );
  }
}

/* ---------- GET (health check) ---------- */
export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  return NextResponse.json(
    { status: "GraphQL API running" },
    { headers: buildHeaders(origin) }
  );
}

// const handler = startServerAndCreateNextHandler<NextRequest>(server, {
//   context: async (req) => ({ req }),
// });

// export { handler as GET, handler as POST };
