import React, { useEffect, useMemo, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Wallet from '../../lib/wallet/Wallet';
import { useSession } from "../../contexts/session";

import './Header.less';


const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(1),
    },
    title: {
        flexGrow: 2,
    },
}));

export function Header() {
    const classes = useStyles();
    const [wallet, setWallet] = useState<Wallet | null>();
    const { session, setSession } = useSession();

    const isConnected = session && session.isConnected;

    async function connect() {
        let wallet = new Wallet();
        wallet.onChange = (wallet) => setWallet(wallet);

        await wallet.connect();
        setWallet(wallet);
        let session = await wallet.signMessage('helloworld');
        setSession(session);
    }

    async function disconnect(){
        setSession(null);
    }

    return (
        <AppBar position="absolute" className="header" elevation={8}>
            <Toolbar className="header">
                <img src="/grape_logo.svg" className="header-logo" alt="logo" />
                <Typography component="h1" variant="h6" color="inherit" className={classes.title} noWrap>
                    Grape
                </Typography>
                <div className="header-menu">
                    <Link to="/" className="header-menu-item"><Button >Home</Button></Link>
                    <Link to="servers" className="header-menu-item"><Button >Servers</Button></Link>
                    <Link to="settings" className="header-menu-item"><Button>Settings</Button></Link>
                </div>
                <div className="header-action">
                    <Button color="primary" size="medium" variant="contained" title="Connect" onClick={isConnected ? disconnect : connect}>
                        {isConnected ? 'Disconnect' : 'Conntect'}
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Header;