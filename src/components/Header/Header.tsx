import React, { useEffect, useMemo, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Wallet from '../../lib/wallet/Wallet';
import { useSession } from "../../contexts/session";
import { useLocation } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import './Header.less';

function getParam(param: string) {
    return new URLSearchParams(document.location.search).get(param);
}

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(1),
    },
    title: {
        flexGrow: 2,
    },
}));

export function Header(props: any) {
    const classes = useStyles();
    const [wallet, setWallet] = useState<Wallet | null>();
    const { session, setSession } = useSession();
    const [userId, setUserId] = React.useState(getParam('user_id'));
    const [providers, setProviders] = React.useState(['Sollet', 'Sollet Extension', 'Phantom']);
    const [open, setOpen] = React.useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const location = useLocation();
    const currPath = location.pathname;
    const routes = [
        { name: "Home", path: "/" },
        // { name: "Servers", path: "/servers" },
        // { name: "Settings", path: "/settings" }
    ]

    const isConnected = session && session.isConnected;

    async function connect() {
        let wallet = new Wallet();
        wallet.onChange = (wallet) => onWalletChange(wallet);

        await wallet.connect();
        //wallet.wallet._popup.focus();
        //setWallet(wallet);
        //let session = await wallet.signMessage('$GRAPE');

    }

    function onWalletChange(wallet: any){
        if(wallet.session){
            setSession(wallet.session);
        }
        setWallet(wallet);
    }

    async function disconnect() {
        setSession(null);
        window.location.href = "/"
    }

    function trimAddress(addr: string) {
        let start = addr.substring(0, 8);
        let end = addr.substring(addr.length - 4);
        return `${start}...${end}`;
    }

    //Menu
    const menuId = 'primary-search-account-menu';

    const handleProfileMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleClickOpen = () => {
        connect();
    };

    const handleClose = (value: any) => {
        setOpen(false);
    };

    function SimpleDialog(props: any) {
        const { onClose, selectedValue, open } = props;

        const handleClose = () => {
            onClose(selectedValue);
        };

        const handleListItemClick = (value: any) => {
            onClose(value);
        };

        return (
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <DialogTitle id="simple-dialog-title">Select Wallet</DialogTitle>
                <List>
                    {providers.map((provider) => (
                        <ListItem button onClick={() => handleListItemClick(provider)} key={provider}>

                            <ListItemText primary={provider} />
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        );
    }


    return (
        <AppBar position="absolute" className="header" elevation={0}>
            <Toolbar className="header">
                <img src="/grape_logo.svg" className="header-logo" alt="logo" />
                <Typography component="h1" variant="h6" color="inherit" className={classes.title} noWrap>
                </Typography>
                {/* {isConnected && <div className="header-menu">
                    {routes.map(route =>
                        <Link to={route.path} ><Button className={"header-menu-item " + (route.path === currPath ? "active" : "")}>{route.name}</Button></Link>
                    )}
                </div>} */}
                <div className="header-action">
                    {(isConnected || !userId) && <Button
                        aria-controls={menuId}
                        aria-haspopup="true"
                        color="primary" size="medium" variant="contained" title="Connect" onClick={isConnected ? handleProfileMenuOpen : handleClickOpen}>
                        {isConnected ? session && trimAddress(session.publicKey) : 'Connect'}
                    </Button>}
                    <Menu
                        anchorEl={anchorEl}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        id={menuId}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={isMenuOpen}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={disconnect}>Disconnect</MenuItem>
                    </Menu>

                    <SimpleDialog open={open} onClose={handleClose} />

                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
