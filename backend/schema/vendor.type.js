const { gql } = require('apollo-server-express')

module.exports = gql`
enum VendorStatus {
    lead
    booked
    paid
    cancelled
    }

  type Vendor {
    id: ID!
    subEventId: ID!
    name: String!
    categoryId: ID
    price: Int
    status: VendorStatus
  }

  extend type Query {
    vendors(subEventId: ID!): [Vendor]
  }

  input AddVendorInput {
    name: String!
    categoryId: ID
    price: Int
  }

  input UpdateVendorInput {
    id: ID!
    status: VendorStatus!
  }

  extend type Mutation {
    addVendor(subEventId: ID!, input: AddVendorInput!): Vendor
    deleteVendor(id: ID!): Boolean
    updateVendor(input: UpdateVendorInput!): Vendor
  }
`
