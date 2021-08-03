import React from "react";
import Container from "@material-ui/core/Container";
import { useSession } from "../../contexts/session";
import Box from "../../components/Box/Box";
import "./Home.less";
import { ServersView, SettingsView, PortfolioView } from "../";
import Grid from "@material-ui/core/Grid";

export const HomeView = () => {
  const { session } = useSession();
  const isConnected = session && session.isConnected;
  return (
    <div className="home main">
      {isConnected ? (
        <Grid container spacing={3}>
          <Grid item lg={6} md={12} sm={12}>
            <PortfolioView />
          </Grid>
          <Grid item lg={6} md={12} sm={12}>
            <ServersView />
            <SettingsView />
          </Grid>
        </Grid>
      ) : (
        <Container maxWidth="md" className="main">
          <Box>{"Not connected"}</Box>
        </Container>
      )}
    </div>
  );
};
