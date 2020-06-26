const { ApolloServer, gql } = require("apollo-server");

const users = [
  {
    name: "Tanuj",
    age: 30,
    id: 1,
  },
  {
    name: "John",
    age: 30,
    id: 2,
  },
];

const posts = [
  {
    title: "Test title 1",
    body: "Test content 1",
    id: 1,
    author: "2",
  },
  {
    title: "Test title 2",
    body: "Test content 2",
    id: 2,
    author: "1",
  },
  {
    title: "Test title 3",
    body: "Test content 3",
    id: 3,
    author: "1",
  },
];

const typeDefs = gql`
  type User {
    id: ID
    name: String
    age: Int
    posts: [Post!]!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    author: User!
  }
  type Query {
    message: String!
    users: [User!]!
    user(id: ID!): User
    posts(title: String): [Post!]!
  }
  type Mutation {
    createUser(name: String!, age: Int!): User
  }
`;

const resolvers = {
  Query: {
    message: () => {
      return "This is a message";
    },
    users: (parent, args) => {
      if (args.query) {
        return users.filter((user) => user.name.includes(args.query));
      }

      return users;
    },
    user: (parent, args) => {
      return users.find((user) => user.id == args.id);
    },
    posts: (parent, args) => {
      if (args.title) {
        return posts.filter((post) => post.title.includes(args.title));
      }
      return posts;
    },
  },
  Mutation: {
    createUser: (parent, args) => {
      const { age, name } = args;
      const id = users.length;
      const newUser = {
        id,
        name,
        age,
      };
      users.push(newUser);
      return newUser;
    },
  },
  Post: {
    author: (parent, args) => {
      return users.find((user) => user.id == parent.author);
    },
  },
  User: {
    posts: (parent, args) => {
      return posts.filter((post) => post.author == parent.id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen({ port: 3214 })
  .then((res) => console.log("The server is up"))
  .catch((err) => console.error(err));
