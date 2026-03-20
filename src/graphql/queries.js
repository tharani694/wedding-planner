import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me { id name email partnerName weddingDate weddingVenue totalBudget }
  }
`;

export const GET_GUESTS = gql`
  query GetGuests($subEventId: ID) {
    guests(subEventId: $subEventId) { id name phone rsvp dietary tableNumber }
  }
`;

export const GET_VENDORS = gql`
  query GetVendors($subEventId: ID) {
    vendors(subEventId: $subEventId) { id name price categoryId status }
  }
`;

export const GET_BUDGET = gql`
  query GetBudget($subEventId: ID) {
    budget(subEventId: $subEventId) { id total categories { id name allocated spent } }
  }
`;

export const GET_EVENTS = gql`
  query GetEvents {
    events { id name type totalBudget subEvents { id name date } }
  }
`;

export const GET_VENDOR_PROFILES = gql`
  query GetVendorProfiles {
    vendorProfiles { id name categoryName price rating tags description }
  }
`;

export const GET_CHECKLIST = gql`
  query GetChecklist {
    checklistItems { id title category dueDate completed aiGenerated }
  }
`;

export const AI_BUDGET_ADVICE = gql`
  query AiBudgetAdvice { aiBudgetAdvice }
`;

export const AI_GENERATE_CHECKLIST = gql`
  query AiGenerateChecklist {
    aiGenerateChecklist { title category dueDate }
  }
`;

export const DASHBOARD_QUERY = gql`
  query Dashboard {
    guests { id rsvp }
    vendors { id status price }
    budget { id total categories { id name allocated spent } }
    checklistItems { id completed }
  }
`;