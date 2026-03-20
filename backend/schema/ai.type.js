import { gql } from 'apollo-server-express';
export default gql`
  input ChatHistoryInput {
    role: String!
    content: String!
  }

  type ChecklistSuggestion {
    title: String!
    category: String
    dueDate: String
  }

  extend type Query {
    aiChat(message: String!, history: [ChatHistoryInput]): String
    aiGenerateChecklist: [ChecklistSuggestion]
    aiBudgetAdvice: String
  }
`;