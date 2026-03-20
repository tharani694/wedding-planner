import { gql } from "apollo-server-express"
import { mergeTypeDefs } from '@graphql-tools/merge'

import authType from './auth.type.js'
import guestType from './guest.type.js'
import vendorType from './vendor.type.js'
import budgetType from './budget.type.js'
import vendorProfileType from './vendorProfile.type.js'
import eventType from './event.type.js'
import subEventType from './subEvent.type.js'
import checklistType from './checklist.type.js'
import aiType from './ai.type.js'

const base = gql`
  type Query
  type Mutation
`

const typeDefs = mergeTypeDefs([
  base,
  authType,
  eventType,
  guestType,
  vendorType,
  budgetType,
  vendorProfileType,
  subEventType,
  checklistType,
  aiType,
])

export default typeDefs