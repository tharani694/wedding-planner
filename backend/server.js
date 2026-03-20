import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./schema/index.js";
import resolvers from "./resolvers/index.js";
import connectDB from "./config.js";
import { getUser } from "./middleware/auth.js";

dotenv.config();
connectDB();

const app = express();

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://studio.apollographql.com",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(null, true); // Allow all in dev — tighten in production
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get("/health", (_, res) => res.json({ status: "ok" }));

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const user = await getUser(req);
      return { user };
    },
    introspection: true,
    playground: true,
    cors: {
      origin: ALLOWED_ORIGINS,
      credentials: true,
    },
  });

  await server.start();
  // Let Apollo handle its own CORS so Studio works
  server.applyMiddleware({ app, path: "/graphql", cors: corsOptions });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🎮 Playground: http://localhost:${PORT}/graphql`);
  });
};

startServer().catch(console.error);