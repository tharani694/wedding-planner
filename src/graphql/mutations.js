import { gql } from "@apollo/client";

export const ADD_GUEST = gql`
  mutation AddGuest($subEventId: ID, $input: AddGuestInput!) {
    addGuest(subEventId: $subEventId, input: $input) { id name phone rsvp dietary tableNumber }
  }
`;
export const UPDATE_GUEST = gql`
  mutation UpdateGuest($input: UpdateGuestInput!) {
    updateGuest(input: $input) { id name phone rsvp dietary tableNumber }
  }
`;
export const DELETE_GUEST = gql`
  mutation DeleteGuest($id: ID!) { deleteGuest(id: $id) }
`;

export const ADD_VENDOR = gql`
  mutation AddVendor($subEventId: ID, $input: AddVendorInput!) {
    addVendor(subEventId: $subEventId, input: $input) { id name price categoryId status }
  }
`;
export const UPDATE_VENDOR = gql`
  mutation UpdateVendor($input: UpdateVendorInput!) {
    updateVendor(input: $input) { id status }
  }
`;
export const DELETE_VENDOR = gql`
  mutation DeleteVendor($id: ID!) { deleteVendor(id: $id) }
`;

export const ADD_VENDOR_FROM_PROFILE = gql`
  mutation AddVendorFromProfile($profileId: ID!) {
    addVendorFromProfile(profileId: $profileId) { id name price status }
  }
`;

export const ADD_BUDGET_CATEGORY = gql`
  mutation AddBudgetCategory($budgetId: ID!, $name: String!, $allocated: Int) {
    addBudgetCategory(budgetId: $budgetId, name: $name, allocated: $allocated) { id name allocated spent }
  }
`;
export const UPDATE_BUDGET_CATEGORY = gql`
  mutation UpdateBudgetCategory($input: UpdateBudgetCategoryInput!) {
    updateBudgetCategory(input: $input) { id name allocated spent }
  }
`;
export const DELETE_BUDGET_CATEGORY = gql`
  mutation DeleteBudgetCategory($id: ID!) { deleteBudgetCategory(id: $id) { id } }
`;
export const UPDATE_BUDGET_TOTAL = gql`
  mutation UpdateBudgetTotal($total: Int!) {
    updateBudgetTotal(total: $total) { id total categories { id name allocated spent } }
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent($name: String!, $type: String!) {
    createEvent(name: $name, type: $type) { id name type }
  }
`;
export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) { deleteEvent(id: $id) }
`;
export const CREATE_SUB_EVENT = gql`
  mutation CreateSubEvent($eventId: ID!, $name: String!, $date: String) {
    createSubEvent(eventId: $eventId, name: $name, date: $date) { id name date }
  }
`;

export const ADD_CHECKLIST_ITEM = gql`
  mutation AddChecklistItem($title: String!, $category: String, $dueDate: String) {
    addChecklistItem(title: $title, category: $category, dueDate: $dueDate) { id title category dueDate completed }
  }
`;
export const TOGGLE_CHECKLIST_ITEM = gql`
  mutation ToggleChecklistItem($id: ID!) {
    toggleChecklistItem(id: $id) { id completed }
  }
`;
export const DELETE_CHECKLIST_ITEM = gql`
  mutation DeleteChecklistItem($id: ID!) { deleteChecklistItem(id: $id) }
`;
export const BULK_ADD_CHECKLIST = gql`
  mutation BulkAddChecklistItems($items: [ChecklistInput!]!) {
    bulkAddChecklistItems(items: $items) { id title category dueDate completed aiGenerated }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) { id name email partnerName weddingDate weddingVenue totalBudget }
  }
`;