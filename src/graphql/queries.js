import { gql } from "@apollo/client";

export const GET_VENDOR_PROFILES = gql`
  query {
    vendorProfiles {
      id
      name
      categoryName
      price
      tags
      rating
    }
  }
`;

export const GET_VENDORS = gql`
  query {
    vendors {
      id
      name
      price
      categoryId
      status
    }
  }
`;

export const GET_GUESTS = gql`
    query {
        guests {
            id
            name
            phone
            rsvp
        }
    }`;

export const GET_BUDGET = gql`
    query {
        budget {
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

export const DASHBOARD_QUERY = gql`
  query DashboardStats {
    guests {
      id
      rsvp
    }
    vendors {
      id
      status
    }
  }
`;

export const NAV_STATS_QUERY = gql`
  query NavStats {
    guests {
      id
    }
    vendors {
      id
    }
  }
`;