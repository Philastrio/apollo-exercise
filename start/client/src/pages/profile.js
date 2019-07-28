import React, { Fragment } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { Loading, Header, LaunchTile } from "../components";
import { LAUNCH_TILE_DATA } from "./launches";

export const GET_MY_TRIPS = gql`
  query GetMyTrips {
    me {
      id
      email
      trips {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

/* By default, Apollo Client's fetch policy is cache-first, 
   which means it checks the cache to see if the result is there before making a network request. 
   Since we want this list to always reflect the newest data from our graph API, 
   we set the  fetchPolicy for this query to network-only
 */

export default function Profile() {
  return (
    <Query query={GET_MY_TRIPS} fetchPolicy="network-only">
      {({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <p>ERROR: {error.message}</p>;

        return (
          <Fragment>
            <Header>내 여행</Header>
            {data.me && data.me.trips.length ? (
              data.me.trips.map(launch => (
                <LaunchTile key={launch.id} launch={launch} />
              ))
            ) : (
              <p>당신은 아직 예약안했습니다</p>
            )}
          </Fragment>
        );
      }}
    </Query>
  );
}
