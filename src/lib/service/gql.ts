import { GraphQLClient } from "graphql-request";

const isServer = typeof window === "undefined";
const getBaseURL = () => {
    if (!isServer) return "";
    if (process.env.NEXT_PUBLIC_URL) return process.env.NEXT_PUBLIC_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
};

export const gqlClient = new GraphQLClient(getBaseURL() + "/api/graphql", {
    credentials: "include",
});