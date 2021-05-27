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

export function Register(props: any) {
    const [serverId, serServerId] = React.useState(getParam('server_id'));
    const { session, setSession } = useSession();
    const [wallet, setWallet] = useState<Wallet | null>();

    async function register() {
        let wallet = new Wallet();
        wallet.onChange = (wallet) => setWallet(wallet);
    
        await wallet.connect();
        setWallet(wallet);
        let session = await wallet.signMessage('helloworld');
        setSession(session);
    }

    return (
        <Container maxWidth="md" className="register">
            <Box>
                <div className="title">
                    <Typography variant="h5" gutterBottom>
                        Great Ape
                    </Typography>
                </div>

                <div className="overlap">
                    <Circle padding={true}><img src="/grape_logo.svg" alt="grape-logo" /></Circle>
                </div>

                <br />
                <Button color="primary" size="medium" variant="contained" onClick={register}>Register</Button>
            </Box>
        </Container>
    );
}
