const { gql } = require('apollo-server-express')

module.exports = gql`
    type Guest {
        id: ID!
        name: String!
        phone: String
        rsvp: String
    }

    extend type Query {
        guests: [Guest]
    }

    input AddGuestInput {
        name: String!
        phone: String 
        rsvp: String
    }

    input UpdateGuestInput {
        id: ID!
        name: String!
        phone: String
        rsvp: String
    }

    extend type Mutation {
        addGuest(input: AddGuestInput!): Guest
        deleteGuest(id: ID!): Boolean
        updateGuest(input: UpdateGuestInput!): Guest
    }
`