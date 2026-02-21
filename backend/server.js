const express = require("express");
const cors = require("cors");

const app = express();
const { ApolloServer } = require("apollo-server-express");
const createResolvers = require('./resolvers/index')
const typeDef = require('./schema')
const data = require('./dataStore')

app.use(cors());


const startGraphQL = async() => {
    const server = new ApolloServer({
      typeDefs: typeDef,
      resolvers: createResolvers(data),
    });
  
    await server.start();
    server.applyMiddleware({ app })
    console.log(`GraphQL ready at http://localhost:4000${server.graphqlPath}`);
  }
  
  startGraphQL();

app.listen(4000, () => {
    console.log("Backend running on http://localhost:4000");
  })
