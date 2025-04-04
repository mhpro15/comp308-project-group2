const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const typeDefs = require("./typedefs");
const resolvers = require("./resolvers");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) throw new Error("User not found");
      req.user = decoded;
    } catch (err) {
      console.warn("Invalid token:", err.message);
    }
  }
  next();
};

async function startServer() {
  const app = express();
  app.use(cookieParser());
  app.use(cors());
  app.use(authMiddleware);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return { req, user: req.user, token: req.headers.authorization };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: process.env.PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    )
  );
}
startServer();
