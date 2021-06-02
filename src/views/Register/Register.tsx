import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Box, Circle } from '../../components';
import { useSession } from "../../contexts/session";
import Wallet from '../../lib/wallet/Wallet';
import User from '../../models/User';
import './Register.less';

function getParam(param: string) {
    return new URLSearchParams(document.location.search).get(param);
}

export function RegisterView(props: any) {
    const [serverId, setServerId] = React.useState(getParam('server_id'));
    const [avatar, setAvatar] = React.useState(getParam('avatar'));
    const [discordId, setDiscordId] = React.useState(getParam('discord_id'));
    const [userId, setUserId] = React.useState(getParam('user_id'));
    const [provider, setProvider] = React.useState(getParam('provider'));
    const [serverName, setServerName] = React.useState(getParam('serverName'));
    const [serverLogo, setServerLogo] = React.useState(decodeURIComponent(getParam('serverLogo')));

    const { session, setSession } = useSession();
    const [wallet, setWallet] = useState<Wallet | null>();
    const isConnected = session && session.isConnected;
    
    async function register() {
        let wallet = new Wallet();
        wallet.onChange = (wallet) => setWallet(wallet);

        await wallet.connect();
        setWallet(wallet);
        setTimeout(async () => {
            let session = await wallet.register('$GRAPE', userId);
            setSession(session);
        }, 100);
    }

    return (
        <Container maxWidth="md" className="register">
            <Box>
                <div className="title">
                    <Typography variant="h5" gutterBottom>
                        Register Wallet with <br /> {serverName}
                    </Typography>
                </div>

                <div className="overlap">
                    <Circle padding={false}><img src={`/server-logos/${serverLogo}`} alt="grape-logo" /></Circle>
                    <Circle padding={false}>
                        {provider === 'discord' && <img src={`https://cdn.discordapp.com/avatars/${discordId}/${avatar}?size=512`} alt="avatar" />}
                    </Circle>
                </div>

                <br />
                {!isConnected ? <Button color="primary" size="large" variant="contained" onClick={register}>Link Wallet</Button> : <div>Registered!</div>}
            </Box>
        </Container>
    );
}
