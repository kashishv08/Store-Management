import { gql } from "graphql-request";

export const LOG_IN = gql`
  mutation LoginUser($password: String!, $userCred: String!) {
    loginUser(password: $password, userCred: $userCred)
  }
`;

export const ALL_USER = gql`
  query Query {
    getAllUser {
      id
      name
      username
      email
      password
      role
      avatar
    }
  }
`;

export const ALL_PROD = gql`
  query Query {
    getAllProd {
      id
      title
      description
      category
      price
      stock
      imageUrl
    }
  }
`;

export const ONE_PROD = gql`
  query Query($getProdByIdId: String!) {
    getProdById(id: $getProdByIdId) {
      id
      title
      description
      category
      price
      stock
      imageUrl
      Sale {
        id
        productId
        quantity
        createdAt
      }
    }
  }
`;

export const FILTER_PROD = gql`
  query FilterProd($input: String, $category: String, $orderBy: String) {
    filterProd(input: $input, category: $category, orderBy: $orderBy) {
      id
      title
      description
      category
      price
      stock
      imageUrl
      Sale {
        id
        productId
        quantity
        createdAt
      }
    }
  }
`;

export const FILTER_USER = gql`
  query FilterUser($input: String, $role: String) {
    filterUser(input: $input, role: $role) {
      id
      name
      username
      email
      password
      role
      avatar
    }
  }
`;

export const CURR_USER = gql`
  query Query {
    currUser {
      id
      name
      username
      email
      password
      role
      avatar
    }
  }
`;
