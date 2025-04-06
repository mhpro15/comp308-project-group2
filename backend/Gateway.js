import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
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

// Configure the gateway
const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "health", url: HEALTH_SERVICE_URL },
      { name: "ai", url: AI_SERVICE_URL },
    ],
    pollIntervalInMs: 30000, // Check for updates every 30 seconds
  }),
  debug: true, // Enable debug mode for more detailed logs
  logger: console, // Use console for logging
});

// Create Apollo Server instance
const server = new ApolloServer({
  gateway,
  // Forward the authentication header to the subgraphs
  introspection: true,
});

// Start the server
const startServer = async () => {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: PORT },
      context: async ({ req }) => {
        // Pass the authorization header to the subgraphs
        const token = req.headers.authorization || "";

        // Track response times and errors for debugging
        console.log(`Gateway received request: ${req.method} ${req.url}`);
        if (token) {
          console.log("Request includes authorization token");
        }

        return {
          headers: {
            ...req.headers,
            authorization: token,
          },
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
            headers: {
              ...req.headers,
              authorization: req.headers.authorization || "",
            },
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
