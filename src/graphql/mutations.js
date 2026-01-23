import { gql } from "@apollo/client";

export const ADD_VENDOR_FROM_PROFILE = gql`
  mutation AddVendorFromProfile($profileId: ID!) {
    addVendorFromProfile(profileId: $profileId) {
      id
      name
      price
      status
    }
  }
`;

export const ADD_VENDOR = gql`
  mutation AddVendor($input: AddVendorInput!) {
    addVendor(input: $input) {
      id
      name
      price
      categoryId
      status
    }
  }
`;

export const DELETE_VENDOR = gql`
  mutation DeleteVendor($id: ID!) {
    deleteVendor(id: $id) {
        id
        name
        price
        categoryId
        status
    }
  }
`;

export const UPDATE_VENDOR = gql`
  mutation UpdateVendor($input: UpdateVendorInput!) {
    updateVendor(input: $input) {
      id
      status
    }
  }
`;

export const DELETE_GUEST = gql`
  mutation DeleteGuest($id: ID!) {
    deleteGuest(id: $id)
  }
`;

export const UPDATE_GUEST = gql`
    mutation UpdateGuest($input: UpdateGuestInput!) {
    updateGuest(input: $input) {
        id
        name
        phone
        rsvp
    }
}
`

export const ADD_GUEST = gql`
  mutation AddGuest($input: AddGuestInput!) {
    addGuest(input: $input) {
      name
      phone
      rsvp
    }
  }
`;

export const UPDATE_BUDGET_TOTAL = gql`
    mutation UpdateBudgetTotal($total: Int!) {
        updateBudgetTotal(total: $total) {
            total
            categories {
                id
                name
                allocated
                spent
            }
        }
    }
`

export const ADD_BUDGET_CATEGORY = gql`
    mutation AddBudgetCategory($name: String!, $allocated: Int) {
        addBudgetCategory(name: $name, allocated: $allocated) {
            id
            name
            allocated
            spent
        }
    }
`

export const UPDATE_BUDGET_CATEGORY = gql`
    mutation UpdateBudgetCategory($input: UpdateBudgetCategory!) {
        updateBudgetCategory(input: $input) {
            id
            name
            allocated
            spent
        }
    }
`

export const DELETE_BUDGET_CATEGORY = gql`
    mutation DeleteBudgetCategory($id: ID!) {
        deleteBudgetCategory(id: $id) {
            id
            name
            allocated
            spent
        }
    }
`