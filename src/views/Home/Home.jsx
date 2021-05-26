import React from "react";
import Container from '@material-ui/core/Container';
import { useSession } from "../../contexts/session";
import Box from '../../components/Box/Box';
import './Home.less';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export const HomeView = (props) => {

  const { session, setSession } = useSession();
  const isConnected = session && session.isConnected;
  const publicKey = session && session.publicKey;
  return (
    <div className="home">

      {/* <Wallet token={token} avatar={avatar} discordId={discordId} /> */}
      {/* {isConnected ? 'Connected' : 'Not Connected'} */}
      <Container maxWidth="md" className="main">
        <Box>{isConnected ? publicKey : 'Not connected'}</Box>
      </Container>
    </div>
  );
}
