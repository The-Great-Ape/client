import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Box, Circle } from '../../components';
import { useSession } from "../../contexts/session";
import Wallet from '../../lib/wallet/Wallet';
import PhantomWallet from '../../lib/wallet/Phantom';
import User from '../../models/User';
import './Register.less';
import Modal from '../../components/Modal/Modal';

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
    const [isRegistered, setIsRegistered] = React.useState(decodeURIComponent(getParam('is_registered')));

    const { session, setSession } = useSession();
    const isConnected = session && session.isConnected;
    const isAlreadyRegistered = isRegistered && isRegistered === "true";

    async function register() {
        let wallet = new Wallet();
        wallet.onChange = (wallet) => onWalletRegister(wallet);

        await wallet.connect();
    }

    async function registerPhantom() {
        let wallet = new PhantomWallet();
        wallet.onChange = (wallet: any) => onWalletRegister(wallet);

        await wallet.connect();
    }


    async function onWalletRegister(wallet: any){
        if(wallet){
            let session = await wallet.register('$GRAPE', userId);
            if(session){
                setSession(session);
            }
        }
    }

    async function connect() {
        let wallet = new Wallet();
        wallet.onChange = (wallet) => onWalletConnect(wallet);
        await wallet.connect();
    }

    async function connectPhantom() {
        let wallet = new PhantomWallet();
        wallet.onChange = (wallet: any) => onWalletConnect(wallet);
        await wallet.connect();
    }

    async function onWalletConnect(wallet: any){
        if(wallet){
            let session = await wallet.signMessage('$GRAPE');
            if(session){
                setSession(session);
            }
        }
    }

    const handleRegister = (type: string, callback: any) => {
        switch(type) {
            case "sollet":
                register();
                break;
            case "phantom":
                registerPhantom();
                break;
            default:
                break;
        }
        callback && callback();
    };

    const handleConnect = (type: string, callback: any) => {
        switch(type) {
            case "sollet":
                connect();
                break;
            case "phantom":
                connectPhantom();
                break;
            default:
                break;
        }
        callback && callback();
    };

    useEffect(() => {
        setSession(null);
      }, [setSession]);

    return (
        <Container maxWidth="md" className="register">
            <Box>
                <div className="title-center">
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
                {!isAlreadyRegistered ? 
                <div>
                    {!isConnected ? <Modal
                    session={session}
                    isConnected={isConnected}
                    userId={userId}
                    menuId='primary-search-account-menu'
                    handleProfileMenuOpen={() => {}}
                    handleClickOpen={handleRegister}
                    buttonText="Link Wallet"
                    
                    /> : 
                    <div>Registered!<br /><br/>
                        <Link to='/'><Button color="primary" size="medium" variant="contained" title="Connect">Home</Button></Link>
                    </div>}
                </div> : 
                <div>
                     {!isConnected ? 
                         <div>Your wallet is already linked!<br /><br/>
                     <Modal
                    session={session}
                    isConnected={isConnected}
                    userId={userId}
                    menuId='primary-search-account-menu'
                    handleProfileMenuOpen={() => {}}
                    handleClickOpen={handleConnect}
                    buttonText="Connect"
                    
                    /> </div>: 
                        <Link to='/'><Button color="primary" size="medium" variant="contained" title="Connect">Home</Button></Link>
                    }
                </div>}
            </Box>
        </Container>
    );
}
