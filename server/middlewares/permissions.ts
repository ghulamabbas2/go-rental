import { and, rule, shield } from "graphql-shield";

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, context) => {
    return context?.user !== null;
  }
);

const isAdmin = rule({ cache: "contextual" })(async (parent, args, context) => {
  return context?.user?.role?.includes("admin");
});

export const permissions = shield({
  Query: {
    me: isAuthenticated,
  },
});
