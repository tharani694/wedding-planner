import { gql } from 'apollo-server-express';
export default gql`

  type SubEvent {
    id: ID!
    name: String!
    eventId: ID!
    budget: Budget
    guests: [Guest]
    vendors: [Vendor]
  }

  extend type Query {
    subEvents(eventId: ID!): [SubEvent]
  }

  extend type Mutation {
    createSubEvent(eventId: ID!, name: String!): SubEvent
    deleteSubEvent(id: ID!): Boolean
  }

`;
