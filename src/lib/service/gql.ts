import { GraphQLClient } from "graphql-request";

export const gqlClient = new GraphQLClient("/api/graphql", {
    credentials: "include",
});