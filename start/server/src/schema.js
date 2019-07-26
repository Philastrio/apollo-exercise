const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    launches(pageSize: Int, after: String): LaunchConnection!
    """
    pageSize: 반드시 1보다 크다. 기본 20
    """
    launch(id: ID!): Launch
    me: User
  }
  """
  리스트의 마지막 아이템에 대한 cursor까지 포함하는 wrapper이다.
  여기에 포함된 cursor를 가져온 발사 쿼리에 넘긴다
  """
  type Mutation {
    #if false, booking trips failed -- check errors
    bookTrips(launchIds: [ID]!): TripUpdateResponse!

    #if false, cancellation failed -- check errors
    cancelTrip(launchId: ID!): TripUpdateResponse!
    login(email: String): String #login token
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }

  type LaunchConnection {
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type User {
    id: ID!
    email: String!
    trips: [Launch]!
  }

  type Mission {
    name: String
    missionPatch(mission: String, size: PatchSize): String
  }

  enum PatchSize {
    SMALL
    LARGE
  }
`;

module.exports = typeDefs;
