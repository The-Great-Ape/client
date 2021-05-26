import React from "react";
import Container from '@material-ui/core/Container';
import { useSession } from "../../contexts/session";

export const HomeView = (props) => {
 
  const { session, setSession } = useSession();
  const isConnected = session && session.isConnected;

  return (
    <Container maxWidth="sm" className="main">

      {/* <Wallet token={token} avatar={avatar} discordId={discordId} /> */}
      {isConnected ? 'Connected' : 'Not Connected'}
    </Container>
  );
}
