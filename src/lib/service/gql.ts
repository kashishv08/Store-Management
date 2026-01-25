import { GraphQLClient } from "graphql-request";

export const gqlClient = new GraphQLClient("https://store-management-pink-one.vercel.app/api/graphql", {
    credentials: "include",
});