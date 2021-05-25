import React from "react";
import Container from '@material-ui/core/Container';
import Wallet from '../../components/Wallet/Wallet';
import Paper from '@material-ui/core/Paper';

function getParam(param) {
  return new URLSearchParams(document.location.search).get(param);
}

export const HomeView = (props) => {

  const [token, setToken] = React.useState(getParam('token'));
  const [avatar, setAvatar] = React.useState(getParam('avatar'));
  const [discordId, setDiscordId] = React.useState(getParam('discord_id'));

  return (
    <Container maxWidth="sm" className="main">

      {/* <Wallet token={token} avatar={avatar} discordId={discordId} /> */}
    Splash page
    </Container>
  );
}
