import { gql } from "@apollo/client";

export const GET_ALL_REVIEWS = gql`
  query GetAllReviews($page: Int, $query: String) {
    getAllReviews(page: $page, query: $query) {
      pagination {
        totalCount
        resPerPage
      }
      reviews {
        id
        car {
          name
          id
        }
        rating
        comment
        createdAt
        updatedAt
      }
    }
  }
`;
