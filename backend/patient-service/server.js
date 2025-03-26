import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import express from "express";
import mongoose from "mongoose";
import { gql } from 'graphql-tag'; // Add this import
import typeDefs from "./graphql/typeDefs.js"; // Assuming your type definitions are in typeDefs.js
import resolvers from "./graphql/resolvers.js"; // Assuming your resolvers are in resolvers.js
import dotenv from "dotenv";

const app = express();
dotenv.config();
// Parse the typeDefs with gql tag
const parsedTypeDefs = gql(typeDefs);
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set up Apollo Server using @apollo/server
const server = new ApolloServer({schema: buildSubgraphSchema([{ typeDefs: parsedTypeDefs
  , resolvers }]),});
  

// Start the Apollo Server and express
const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4002 },
  });

  console.log(`Server running at ${url}`);
};

startServer();
