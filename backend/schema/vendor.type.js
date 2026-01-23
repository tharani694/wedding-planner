const { gql } = require('apollo-server-express')

module.exports = gql`
    type Vendor {
        id: ID!
        name: String!
        categoryId: ID
        categoryName: String
        price: Int
        status: String
    }

    extend type Query {
        vendors: [Vendor]
    }

    input AddVendorInput {
        name: String!
        categoryId: ID
        categoryName: String
        price: Int
    }

    input UpdateVendorInput {
        id: ID!
        status: String!
    }

    extend type Mutation {
        addVendor(input: AddVendorInput!): Vendor
        deleteVendor(id: ID!): Vendor
        updateVendor(input: UpdateVendorInput!): Vendor
    }
`