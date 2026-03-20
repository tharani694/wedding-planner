import { gql } from 'apollo-server-express';
export default gql`
  type Guest {
    id: ID!
    subEventId: ID
    name: String!
    phone: String
    rsvp: String
    dietary: String
    tableNumber: String
  }

  extend type Query {
    guests(subEventId: ID): [Guest]
  }

  input AddGuestInput {
    name: String!
    phone: String
    rsvp: String
    dietary: String
    tableNumber: String
  }

  input UpdateGuestInput {
    id: ID!
    name: String
    phone: String
    rsvp: String
    dietary: String
    tableNumber: String
  }

  extend type Mutation {
    addGuest(subEventId: ID, input: AddGuestInput!): Guest
    deleteGuest(id: ID!): Boolean
    updateGuest(input: UpdateGuestInput!): Guest
  }
`