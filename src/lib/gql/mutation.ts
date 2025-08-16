import { gql } from "graphql-request";

export const CREATE_USER = gql`
  mutation Mutation(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
    $role: String!
  ) {
    createUser(
      name: $name
      username: $username
      email: $email
      password: $password
      role: $role
    ) {
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

export const ADD_PROD = gql`
  mutation AddProduct(
    $title: String!
    $description: String!
    $category: String!
    $price: Float!
    $stock: Int!
    $imageUrl: String!
  ) {
    addProduct(
      title: $title
      description: $description
      category: $category
      price: $price
      stock: $stock
      imageUrl: $imageUrl
    ) {
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

export const CREATE_SALE = gql`
  mutation CreateSale($createSaleId: String!, $quantity: Int!) {
    createSale(id: $createSaleId, quantity: $quantity)
  }
`;

export const EDIT_USER_BY_ADMIN = gql`
  mutation Mutation(
    $userId: String!
    $role: String
    $name: String
    $username: String
    $email: String
    $password: String
  ) {
    updateUserByAdmin(
      userId: $userId
      role: $role
      name: $name
      username: $username
      email: $email
      password: $password
    )
  }
`;

export const REMOVE_MEMBER = gql`
  mutation RemoveMember($userId: String!) {
    RemoveMember(userId: $userId)
  }
`;

export const EDIT_PRODUCT = gql`
  mutation EditProduct(
    $id: String!
    $title: String
    $description: String
    $category: String
    $price: Float
    $stock: Int
    $imageUrl: String
  ) {
    editProduct(
      id: $id
      title: $title
      description: $description
      category: $category
      price: $price
      stock: $stock
      imageUrl: $imageUrl
    )
  }
`;

export const DEL_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;

export const EDIT_PROFILE = gql`
  mutation Mutation(
    $userId: String!
    $name: String
    $email: String
    $username: String
    $avatar: String
  ) {
    updateProfile(
      userId: $userId
      name: $name
      email: $email
      username: $username
      avatar: $avatar
    )
  }
`;

export const LOG_OUT = gql`
  mutation Logout($id: String!) {
    logout(id: $id)
  }
`;
