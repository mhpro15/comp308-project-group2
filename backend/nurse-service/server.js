import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { gql } from 'graphql-tag'; // Add this import
import typeDefs from "./graphql/typeDefs.js";
import express from "express";
import mongoose from "mongoose";
import resolvers from "./graphql/resolvers.js"; 
import dotenv from "dotenv";
import PatientAPI from "./datasources/patient-api.js";


const app = express();
dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Parse the typeDefs with gql tag
const parsedTypeDefs = gql(typeDefs);

// Set up Apollo Server
const server = new ApolloServer({
  schema: buildSubgraphSchema([{ 
    typeDefs: parsedTypeDefs,
    resolvers 
  }]),
});

// Start the server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4001 },
  context: async () => ({
    dataSources: {
      patientAPI: new PatientAPI()
    }
  })
});

console.log(`🚀 Server ready at ${url}`);
