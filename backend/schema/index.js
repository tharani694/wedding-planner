const { gql } = require("apollo-server-express")
const guestType = require('./guest.type')
const vendorType = require('./vendor.type')
const budgetType = require('./budget.type')
const vendorProfileType = require('./vendorProfile.type')
const { mergeTypeDefs } = require('@graphql-tools/merge')

const base = gql`
  type Query
  type Mutation
`

const typeDefs = mergeTypeDefs([
  base,
  guestType,
  vendorType,
  budgetType,
  vendorProfileType
])

module.exports = typeDefs