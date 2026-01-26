import { GraphQLClient } from "graphql-request";

const isServer = typeof window === "undefined";
const baseURL = isServer ? process.env.NEXT_PUBLIC_URL : "";

export const gqlClient = new GraphQLClient((baseURL || "") + "/api/graphql", {
    credentials: "include",
});