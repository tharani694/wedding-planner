const { gql } = require('apollo-server-express')

module.exports = gql`
    type BudgetCategory {
        id: ID!
        name: String!
        allocated: Int
        spent: Int
    }
    
    type Budget {
        total: Int
        categories: [BudgetCategory]
    }

    extend type Query {
        budget: Budget
    }
    
    input UpdateBudgetCategory {
        id: ID!
        name: String
        allocated: Int
    }

    extend type Mutation {
        updateBudgetTotal(total: Int!): Budget
        addBudgetCategory(name: String!, allocated: Int): BudgetCategory
        updateBudgetCategory(input: UpdateBudgetCategory!): BudgetCategory
        deleteBudgetCategory(id: ID!): BudgetCategory
    }
`