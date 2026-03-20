import { gql } from 'apollo-server-express';

export default gql`
  type User {
    id: ID!
    name: String!
    email: String!
    partnerName: String
    weddingDate: String
    weddingVenue: String
    totalBudget: Int
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input UpdateProfileInput {
    name: String
    partnerName: String
    weddingDate: String
    weddingVenue: String
    totalBudget: Int
  }

  extend type Query {
    me: User
  }

  extend type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateProfile(input: UpdateProfileInput!): User!
  }
`;