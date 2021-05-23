// @ts-ignore
import SolanaWalletAdapter from '@project-serum/sol-wallet-adapter';
import bs58 from 'bs58';

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


const PROVIDERS: { [key: string]: string } = {
    SOLLET: "https://www.sollet.io"
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
    onChange: (wallet: Wallet | null) => void;

    //Constructor
    constructor(provider: string = "SOLLET", network: string = "MAINNET") {
        let providerUrl = PROVIDERS[provider];
        this.connection = new Connection(clusterApiUrl(NETWORKS["MAINNET"]));
        this.wallet = new SolanaWalletAdapter(providerUrl);
        this.onChange = () => { };

        this.wallet.on('connect', this.onConnect.bind(this));
        this.wallet.on('disconnect', this.onDisconnect.bind(this));
    }

    //Events
    async onConnect(publicKey: PublicKey) {
        this.publicKey = publicKey;
        this.isConnected = true;
        this.onChange(this);
        console.log('Connected to ' + publicKey.toBase58());
    }


    async onDisconnect() {
        this.isConnected = false;
        console.log('yooo');
        console.log('onchangeee');
        this.onChange(null);
        console.log('Disconnected')
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
        try {
            const data = new TextEncoder().encode(token);
            const signed = await this.wallet.sign(data, 'hex');
              
            const response = await fetch('http://localhost:4000/validate', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    address: this.publicKey.toBuffer(),
                    signature: signed.signature

                })
            })
            const responseMessage = await response.json();
            console.log('responseMessage', responseMessage);
            return responseMessage;
        } catch (e) {
            console.warn(e);
        }
    }


}

export default Wallet;
