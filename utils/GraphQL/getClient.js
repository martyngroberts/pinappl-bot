import { GraphQLClient } from 'graphql-request'

const getClient = () => {
  const endpoint = process.env.API_ENDPOINT
  const graphQLClient = new GraphQLClient(endpoint)
  return graphQLClient
}

export default getClient
