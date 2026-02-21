import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./schema/index.js";
import resolvers from "./resolvers/index.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // attach user from auth middleware if you have one
      return { user: req.user || null };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(process.env.PORT || 4000, () => {
    console.log(
      `🚀 GraphQL ready at http://localhost:4000${server.graphqlPath}`
    );
  });
};
startServer();
