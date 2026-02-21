const { gql } = require('apollo-server-express')

module.exports = gql`
  type Event {
    id: ID!
    name: String!
    type: String!
    subEvents: [SubEvent]
    totalBudget: Int
 }

type SubEvent {
  id: ID!
  name: String!
  date: String
  budget: Budget
  guests: [Guest]
  vendors: [Vendor]
}

  extend type Query {
    event(id: ID!): Event
    events: [Event]
    subEvents(eventId: ID!): [SubEvent]
  }

  extend type Mutation {
    createEvent(name: String!, type: String!): Event
    deleteEvent(id: ID!): String
    createSubEvent(eventId: ID!, name: String!, date: String): SubEvent
  }
`
