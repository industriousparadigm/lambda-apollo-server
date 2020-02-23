const { ApolloServer, gql } = require('apollo-server-lambda')

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
})

exports.graphqlHandler = (event, lambdaContext, callback) => {
  // Playground handler
  if (event.httpMethod === 'GET') {
    server.createHandler()(
      { ...event, path: event.requestContext.path || event.path },
      lambdaContext,
      callback,
    )
  } else {
    server.createHandler()(event, lambdaContext, callback)
  }
}