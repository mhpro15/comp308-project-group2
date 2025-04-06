import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/subgraph";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import typeDefs from "./typedefs.js";
import resolvers from "./resolvers.js";

// Import predictionService to preload model
import predictionService from "./predictionService.js";

// ES module support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize express
const app = express();
app.use(cors());
app.use(express.json());

// Define port
const PORT = process.env.PORT || 4003;

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  // Extract token from Authorization header
  // Handle both "Bearer token" and just "token" formats
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader) {
    // Check if it's in "Bearer token" format
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove "Bearer " prefix
    } else {
      token = authHeader; // Use the token as is
    }
  }

  console.log("AI Service - Auth header:", authHeader);
  console.log(
    "AI Service - Extracted token:",
    token ? "Token found" : "No token"
  );

  if (!token) {
    req.isAuthenticated = false;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.isAuthenticated = true;
    console.log("AI Service - Authentication successful for user:", decoded.id);
  } catch (err) {
    console.warn("AI Service - Invalid token:", err.message);
    req.isAuthenticated = false;
  }

  next();
};

// Apply authentication middleware
app.use(authMiddleware);

// Protected route middleware
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

// Initialize Apollo Server with Federation subgraph schema
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  introspection: process.env.NODE_ENV !== "production",
});

// Start Apollo Server and apply middleware
async function startServer() {
  // Preload the AI model
  try {
    console.log("Preloading AI prediction model...");
    await predictionService.loadModel();
    console.log("AI model loaded successfully");
  } catch (error) {
    console.error("Error preloading AI model:", error.message);
    console.warn(
      "Service will try to load the model on first prediction request"
    );
  }

  await server.start();

  // Apply Apollo middleware to a specific path
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Log request headers for debugging
        console.log(
          "AI Service GraphQL request headers:",
          JSON.stringify(req.headers, null, 2)
        );

        return {
          headers: req.headers,
          user: req.user,
          isAuthenticated: req.isAuthenticated,
          token: req.headers.authorization,
        };
      },
    })
  );

  // Health check endpoint (public)
  app.get("/health", (req, res) => {
    res.status(200).send("AI Service is running");
  });

  // Add endpoint to list available symptoms (public)
  app.get("/api/symptoms", (req, res) => {
    try {
      res.json({
        symptoms: predictionService.symptomFeatures,
        severityLevels: predictionService.severityLevels,
        targetCondition: predictionService.targetCondition,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add endpoint to make predictions via REST (protected)
  app.post("/api/predict", requireAuth, async (req, res) => {
    try {
      const { symptoms } = req.body;

      if (!symptoms || !Array.isArray(symptoms)) {
        return res.status(400).json({
          error: "Invalid request. Please provide an array of symptoms.",
        });
      }

      const prediction = await predictionService.predict(symptoms);
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Start Express server
  app.listen(PORT, () => {
    console.log(`AI Service is running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`Available symptoms: http://localhost:${PORT}/api/symptoms`);
    console.log(
      `REST prediction endpoint: http://localhost:${PORT}/api/predict (Requires authentication)`
    );
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
});
