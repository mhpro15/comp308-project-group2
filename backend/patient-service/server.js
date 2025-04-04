import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import express from "express";
import mongoose from "mongoose";
import typeDefs from "./graphql/typeDefs.js"; // Assuming your type definitions are in typeDefs.js
import resolvers from "./graphql/resolvers.js"; // Assuming your resolvers are in resolvers.js
import dotenv from "dotenv";

const app = express();
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set up Apollo Server using @apollo/server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the Apollo Server and express
const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`Server running at ${url}`);
};

startServer();
