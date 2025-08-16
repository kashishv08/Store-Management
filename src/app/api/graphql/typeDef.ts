import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    currUser: User
    getAllUser: [User]
    getAllProd: [Product]
    getProdById(id: String!): Product
    getAllSale: [Sale]
    filterProd(category: String, orderBy: String, input: String): [Product]!
    filterUser(input: String, role: String): [User]
  }

  type Mutation {
    loginUser(password: String!, userCred: String!): Boolean!
    createUser(
      name: String!
      username: String!
      email: String!
      password: String!
      role: String!
    ): User
    updateUserByAdmin(
      role: String
      name: String
      username: String
      email: String
      password: String
      userId: String!
    ): Boolean!
    updateProfile(
      userId: String!
      name: String
      email: String
      username: String
      avatar: String
    ): Boolean
    RemoveMember(userId: String!): Boolean!
    addProduct(
      title: String!
      description: String!
      category: String!
      price: Float!
      stock: Int!
      imageUrl: String!
    ): Product
    editProduct(
      id: String!
      title: String
      description: String
      category: String
      price: Float
      stock: Int
      imageUrl: String
    ): Boolean!
    deleteProduct(id: String!): Boolean!
    createSale(id: String!, quantity: Int!): Boolean!
    logout(id: String!): Boolean!
  }

  type User {
    id: String
    name: String
    username: String
    email: String
    password: String
    role: String
    avatar: String
  }

  type Product {
    id: String
    title: String
    description: String
    category: String
    price: Float
    stock: Int
    imageUrl: String
    Sale: [Sale]
  }

  type Sale {
    id: String
    productId: String
    quantity: Int
    createdAt: String
  }
`;
