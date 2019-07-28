import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { GET_LAUNCH_DETAILS } from "../pages/launch";
import Button from "../components/button";
export { GET_LAUNCH_DETAILS };
export const TOGGLE_CART = gql`
  mutation addOrRemoveFromCart($launchId: ID!) {
    addOrRemoveFromCart(id: $launchId) @client
  }
`;
export const CANCEL_TRIP = gql`
  mutation cancel($launchId: ID!) {
    cancelTrip(launchId: $launchId) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

export default function ActionButton({ isBooked, id, isInCart }) {
  return (
    <Mutation
      mutation={isBooked ? CANCEL_TRIP : TOGGLE_CART}
      variables={{ launchId: id }}
      refetchQueries={[
        {
          query: GET_LAUNCH_DETAILS,
          variables: { launchId: id }
        }
      ]}
    >
      {(mutate, { loading, error }) => {
        if (loading) return <p>로딩중...</p>;
        if (error) return <p>에러가 발생했습니다</p>;

        return (
          <div>
            <Button
              onClick={mutate}
              isBooked={isBooked}
              data-testid={"action-button"}
            >
              {isBooked
                ? "이 여행 취소하기"
                : isInCart
                ? "장바구니에서 삭제하기"
                : "장바구니에 추가"}
            </Button>
          </div>
        );
      }}
    </Mutation>
  );
}
