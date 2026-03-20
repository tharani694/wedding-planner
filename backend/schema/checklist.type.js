import { gql } from 'apollo-server-express';

export default gql`
  type ChecklistItem {
    id: ID!
    title: String!
    category: String
    dueDate: String
    completed: Boolean!
    aiGenerated: Boolean
  }

  type ChecklistItemInput {
    title: String!
    category: String
    dueDate: String
  }

  extend type Query {
    checklistItems: [ChecklistItem]
  }

  extend type Mutation {
    addChecklistItem(title: String!, category: String, dueDate: String): ChecklistItem
    toggleChecklistItem(id: ID!): ChecklistItem
    deleteChecklistItem(id: ID!): Boolean
    bulkAddChecklistItems(items: [ChecklistInput!]!): [ChecklistItem]
  }

  input ChecklistInput {
    title: String!
    category: String
    dueDate: String
  }
`;