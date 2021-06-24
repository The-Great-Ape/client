// @ts-ignore
import SolanaWalletAdapter from '@project-serum/sol-wallet-adapter';
import { useSession } from "../../contexts/session";

import {
    AccountInfo,
    Connection,
    PublicKey,
    clusterApiUrl,
    Cluster,
    Transaction,
    SystemProgram,
    RpcResponseAndContext,
} from '@solana/web3.js'
import Session from '../../models/Session';


const PROVIDERS: { [key: string]: string } = {
    SOLLET: "https://www.sollet.io",
};

const NETWORKS: { [key: string]: Cluster } = {
    MAINNET: "mainnet-beta",
    DEVNET: "devnet"
};

class Wallet {
    //Properties
    wallet: typeof SolanaWalletAdapter;
    connection: Connection;
    publicKey: PublicKey;
    isConnected: boolean;
    discordInfo: Object;
    session: Object;
    onChange: (wallet: Wallet | null) => void;

    //Constructor
    constructor(provider: string = "SOLLET", network: string = "MAINNET") {
        let providerUrl = PROVIDERS[provider];
        this.connection = new Connection(clusterApiUrl(NETWORKS["MAINNET"]));

        // switch(provider){

        // }

        if ((window as any).sollet){
            this.wallet = new SolanaWalletAdapter((window as any).sollet);

        }else{
            this.wallet = new SolanaWalletAdapter(providerUrl);
        }

        this.discordInfo = null;
        this.onChange = () => { };
        this.wallet.on('connect', this.onConnect.bind(this));
        this.wallet.on('disconnect', this.onDisconnect.bind(this));
    }

    //Events
    async onConnect(publicKey: PublicKey) {
        this.publicKey = publicKey;
        this.isConnected = true;
        this.onChange(this);
    }


    async onDisconnect() {
        this.isConnected = false;
        this.onChange(null);
    }


    //Functions
    async connect() {
        try {
            await this.wallet.connect();
        } catch (e) {
            console.warn(e);
        }
    }

    async disconnect() {
        try {
            await this.wallet.disconnect();
        } catch (e) {
            console.warn(e);
        }
    }

    async sendTransaction() {
        try {
            let transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: this.publicKey,
                    toPubkey: this.publicKey,
                    lamports: 100,
                })
            );
            transaction.recentBlockhash = (
                await this.connection.getRecentBlockhash()
            ).blockhash;

            transaction.feePayer = this.publicKey;
            let signed = await this.wallet.signTransaction(transaction);
            let signature = await this.connection.sendRawTransaction(signed.serialize());
            await this.connection.confirmTransaction(signature, 'singleGossip');
        } catch (e) {
            console.warn(e);
        }
    }

    toHex(buffer: Uint8Array | string) {
        return Array.prototype.map
            .call(buffer, (x) => ('00' + x.toString(16)).slice(-2))
            .join('');
    }

    async signMessage(token: string) {
        if (!(window as any).sollet){
            this.wallet._popup.focus();

        }else{
            console.log(this.wallet.window);
            window.focus()

        }

        try {

    
            const data = new TextEncoder().encode('$GRAPE');
            const signed = await this.wallet.sign(data, 'utf8');
            //this.wallet.popup.focus();
            const signature = signed.signature;
            const publicKey = this.publicKey.toBase58();
            const address = this.publicKey.toBuffer();

            const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    address,
                    publicKey,
                    signature
                })
            });

            const session = await response.json();
            session.token = {address, signature};
            session.publicKey = publicKey;

            return new Session(session);
        } catch (e) {
            console.warn(e);
        }
    }

    async register(token: string, userId: string) {
        try {
            //if (!(window as any).sollet){
                this.wallet._popup.focus();
            //}

            const data = new TextEncoder().encode('$GRAPE');
            const signed = await this.wallet.sign(data, 'utf8');
            const signature = signed.signature;
            const publicKey = this.publicKey.toBase58();
            const address = this.publicKey.toBuffer();

            const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    token: token,
                    address,
                    publicKey,
                    signature
                })
            });

            const session = await response.json();
            session.token = {address, signature};
            session.publicKey = publicKey;
            
            return new Session(session);
        } catch (e) {
            console.warn(e);
        }
    }
}

export default Wallet;
