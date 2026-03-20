import { gql } from 'apollo-server-express';
export default gql`
  type Budget {
    id: ID!
    subEventId: ID
    total: Int
    categories: [BudgetCategory]
  }

  type BudgetCategory {
    id: ID!
    budgetId: ID!
    name: String!
    allocated: Int
    spent: Int
  }

  extend type Query {
    budget(subEventId: ID): Budget
    budgetCategories(budgetId: ID!): [BudgetCategory]
  }

  input UpdateBudgetCategoryInput {
    id: ID!
    name: String
    allocated: Int
  }

  extend type Mutation {
    addBudgetCategory(budgetId: ID!, name: String!, allocated: Int): BudgetCategory
    updateBudgetCategory(input: UpdateBudgetCategoryInput!): BudgetCategory
    deleteBudgetCategory(id: ID!): BudgetCategory
    updateBudgetTotal(total: Int!): Budget
  }
`