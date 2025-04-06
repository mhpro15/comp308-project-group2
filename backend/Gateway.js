import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import {
  ApolloGateway,
  IntrospectAndCompose,
  RemoteGraphQLDataSource,
} from "@apollo/gateway";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define ports and URLs
const PORT = process.env.PORT || 4001;
const FALLBACK_PORT = process.env.FALLBACK_PORT || 4004;
const HEALTH_SERVICE_URL =
  process.env.HEALTH_SERVICE_URL || "http://localhost:4000/graphql";
const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:4003/graphql";

// Create custom data source class that properly forwards headers
class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    // Copy all headers from the client request to the service request
    if (context && context.headers) {
      const headers = context.headers;

      // Add authorization header if it exists
      if (headers.authorization) {
        // Keep the original format with "Bearer" prefix
        request.http.headers.set("Authorization", headers.authorization);
      }

      // Forward other important headers as needed
      if (headers["content-type"]) {
        request.http.headers.set("Content-Type", headers["content-type"]);
      }

      if (headers["user-agent"]) {
        request.http.headers.set("User-Agent", headers["user-agent"]);
      }
    }
  }
}

// Configure the gateway
const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "health", url: HEALTH_SERVICE_URL },
      { name: "ai", url: AI_SERVICE_URL },
    ],
    pollIntervalInMs: 30000, // Check for updates every 30 seconds
  }),
  buildService({ url }) {
    return new AuthenticatedDataSource({ url });
  },
  debug: true, // Enable debug mode for more detailed logs
  logger: console, // Use console for logging
});

// Create Apollo Server instance
const server = new ApolloServer({
  gateway,
  introspection: true,
});

// Start the server
const startServer = async () => {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: PORT },
      context: async ({ req }) => {
        if (req.headers.authorization) {
          console.log("Request includes authorization token");
        }

        // Return the full headers object to be used by AuthenticatedDataSource
        return {
          headers: req.headers,
        };
      },
    });
    console.log(`🚀 Gateway ready at ${url}`);
    console.log(`Connected to Health Service at: ${HEALTH_SERVICE_URL}`);
    console.log(`Connected to AI Service at: ${AI_SERVICE_URL}`);
  } catch (error) {
    if (error.code === "EADDRINUSE") {
      // Fallback to alternative port
      const { url } = await startStandaloneServer(server, {
        listen: { port: FALLBACK_PORT },
        context: ({ req }) => {
          return {
            headers: req.headers,
          };
        },
      });
      console.log(`🚀 Gateway ready at ${url} (using alternative port)`);
      console.log(`Connected to Health Service at: ${HEALTH_SERVICE_URL}`);
      console.log(`Connected to AI Service at: ${AI_SERVICE_URL}`);
    } else {
      console.error("Failed to start gateway:", error);
      console.error("Error details:", error.message, error.stack);
      process.exit(1);
    }
  }
};

startServer();
