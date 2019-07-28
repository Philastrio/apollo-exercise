import React, { Fragment } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { Header, Loading } from "../components";
import { CartItem, BookTrips } from "../containers";

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems @client
  }
`;

export default function Cart() {
  return (
    <Query query={GET_CART_ITEMS}>
      {({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <p>ERROR: {error.message}</p>;

        return (
          <Fragment>
            <Header>장바구니</Header>
            {!data.cartItems || !data.cartItems.length ? (
              <p data-testid="empty-message">장바구니에 담긴 물품이 없습니다</p>
            ) : (
              <Fragment>
                {data.cartItems.map(launchId => (
                  <CartItem key={launchId} launchId={launchId} />
                ))}
                <BookTrips cartItems={data.cartItems} />
              </Fragment>
            )}
          </Fragment>
        );
      }}
    </Query>
  );
}
