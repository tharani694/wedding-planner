import { gql } from 'apollo-server-express'

export default gql`

  type VendorProfile {
    id: ID!
    name: String!
    categoryName: String
    categoryId: ID
    price: Int
    rating: Float
    tags: [String]
    description: String
  }

  extend type Query {
    vendorProfiles: [VendorProfile]
  }

  extend type Mutation {
    seedVendorProfiles: [VendorProfile]
    addVendorFromProfile(profileId: ID!, subEventId: ID): Vendor
  }
`
