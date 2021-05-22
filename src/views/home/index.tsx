import React from "react";
import Container from '@material-ui/core/Container';
import Wallet from '../../components/Wallet/Wallet';

export const HomeView = () => {
  return (
    <Container maxWidth="sm" className="main">
      <img src="/logo.png" alt="logo" className="logo"/>

        <Wallet />
    </Container>
  );
}
