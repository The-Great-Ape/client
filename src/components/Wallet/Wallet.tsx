import React, { useEffect, useMemo, useState } from 'react';
import Button from '@material-ui/core/Button';
import Wallet from '../../lib/wallet/Wallet';
import './Wallet.css';
import Snackbar from "../Snackbar";

type WalletProps = {
    token: string;
    avatar: string;
    discordId: string;
}

export default function (props: WalletProps) {
    const [wallet, setWallet] = useState<Wallet | null>();

    // useEffect(() => {
    //     console.log('wallet changed');
    // }, [wallet, wallet.isConnected])

    async function connect() {
        let wallet = new Wallet();
        wallet.onChange = (wallet) => setWallet(wallet);

        await wallet.connect();
        setWallet(wallet);
    }

    const sign = async () => {
        let response = await wallet.signMessage(props.token, props.discordId);
    
        if (response) {
        //   setState({
        //     open: true,
        //     vertical: 'top',
        //     horizontal: 'center',
        //     message: 'Success'
        //   });
        }
      };

    return (
        <div className="wallet">
            <div className="logo"><img src="/logo.png" alt="logo" /></div>
            <div className="logo"><img src={`https://cdn.discordapp.com/avatars/${props.discordId}/${props.avatar}?size=512`} alt="avatar" /></div>

            {wallet && wallet.isConnected ? (
                <div>
                    <p className="info">{wallet.publicKey.toBase58()}</p>
                    {/* <Button color="primary" variant="contained" className="button" size="large" onClick={() => wallet.sendTransaction()}>Send Transaction</Button> */}
                    {/* <Button color="primary" variant="contained" className="button" size="large" onClick={() => wallet.signMessage(props.token)}>Sign Message</Button> */}
                    {/* <Snackbar wallet={wallet} token={props.token} avatar={props.avatar} discordId={props.discordId}>Sign Message</Snackbar> */}
                    <Button
                        color="primary"
                        variant="contained"
                        className="button"
                        size="large"
                        onClick={sign}>
                        Link Discord to Wallet
                    </Button>
                    <Button color="primary" variant="contained" className="button" size="large" onClick={() => wallet.disconnect()}>Disconnect</Button>
                </div>
            ) : (
                <div>
                    <Button color="primary" variant="contained" size="large" onClick={connect}>Connect Sollet</Button>
                    {/* <button onClick={() => setSelectedWallet(injectedWallet)}>Connect to Injected Wallet</button> */}
                </div>
            )}
        </div>
    );
}
