import React from "react";
import styled from "react-emotion";
import { ApolloConsumer } from "react-apollo";

import { menuItemClassName } from "../components/menu-item";
import { ReactComponent as ExitIcon } from "../assets/icons/exit.svg";

const StyledButton = styled("button")(menuItemClassName, {
  background: "none",
  border: "none",
  padding: 0
});

export default function LogoutButton() {
  return (
    <ApolloConsumer>
      {client => (
        <StyledButton
          onclick={() => {
            client.writeData({ data: { isLoggedIn: false } });
            localStorage.clear();
          }}
        >
          <ExitIcon>로그아웃</ExitIcon>
        </StyledButton>
      )}
    </ApolloConsumer>
  );
}
