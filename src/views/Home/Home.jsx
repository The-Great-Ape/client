import React from "react";
import Container from '@material-ui/core/Container';
import { useSession } from "../../contexts/session";
import Box from '../../components/Box/Box';
import './Home.less';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ServersView, SettingsView, ConfirmationView, RegisterView, PortfolioView } from "../";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

export const HomeView = (props) => {

  const { session, setSession } = useSession();
  const isConnected = session && session.isConnected;
  const publicKey = session && session.publicKey;
  return (
    <div className="home main" >
      {isConnected ? <Grid container spacing={3}>
        <Grid item lg={6} md={12} sm={12}>
          <PortfolioView/>
        </Grid>
        <Grid item lg={6} md={12} sm={12}>
          <ServersView />
          <SettingsView />
        </Grid>
      </Grid> : <Container maxWidth="md" className="main">
        <Box>{'Not connected'}</Box>
      </Container>}
    </div>
  );
}
