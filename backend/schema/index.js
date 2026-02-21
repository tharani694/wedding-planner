const { gql } = require("apollo-server-express")
const guestType = require('./guest.type')
const vendorType = require('./vendor.type')
const budgetType = require('./budget.type')
const vendorProfileType = require('./vendorProfile.type')
const eventType = require('./event.type')
const subEventType = require('./subEvent.type')
const { mergeTypeDefs } = require('@graphql-tools/merge')

const base = gql`
  type Query
  type Mutation
`

const typeDefs = mergeTypeDefs([
  base,
  eventType,
  guestType,
  vendorType,
  budgetType,
  vendorProfileType,
  subEventType
])

module.exports = typeDefs
