import bs58 from 'bs58';
import { EventEmitter } from "events";
import { PublicKey } from "@solana/web3.js";
import Session from '../../models/Session';

class PhantomAdapter extends EventEmitter {

  static label = 'Phantom';
  static icon = `${process.env.PUBLIC_URL}/images/wallets/phantom.png`;


  static getProvider = () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
    window.open("https://phantom.app/", "_blank");
  };

  constructor(cluster) {
    super();
    this.cluster = cluster;
    this.instance = PhantomAdapter.getProvider();

    this._popup = this.instance._popup;
    this.connect = this.instance.connect;
    this.connected = this.instance.connected;
    this.disconnect = this.instance.disconnect;

    this.onChange = (wallet) => { };
    if (this.instance) {
      this.instance.on("connect", this.onConnect);
      this.instance.on("disconnect", this.onDisconnect);
    }
  }

  onConnect = (publicKey) => {
    this.signTransaction = this.instance.signTransaction;
    this.connected = true;
    this.onChange(this);

    if (this.publicKey) {
      this.disconnect();
    } else {
      this.publicKey = new PublicKey(publicKey.toString());
      this.emit("connect", this.publicKey, 'phantom');
    }
  };

  onDisconnect = (...args) => {
    this.emit("disconnect", args);
    this.connected = false;
    this.onChange(null);
    this.instance.off("connect", this.onConnect);
    this.instance.off("disconnect", this.onDisconnect);
    this.instance = null;
  };

  signMessage = async (data) => {

    const bytes = Buffer.from(data);
    const message = bs58.encode(bytes);
    const signed = await this.instance.request({
      method: "signTransaction",
      params: { message },
    });

    signed.signature = bs58.decode(signed.signature);
    const signature = signed.signature;
    const publicKey = signed.publicKey;
    const address = bs58.decode(signed.publicKey);

    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          token: data,
          address,
          publicKey,
          signature
      })
    });

    const session = await response.json();
    session.token = {address, signature};
    session.publicKey = publicKey;

    return new Session(session);
  };

  register = async (token, userId) => {

    const bytes = Buffer.from('$GRAPE');
    const message = bs58.encode(bytes);
    const signed = await this.instance.request({
      method: "signTransaction",
      params: { message },
    });

    signed.signature = bs58.decode(signed.signature);
    const signature = signed.signature;
    const publicKey = signed.publicKey;
    const address = bs58.decode(signed.publicKey);

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
    
  }
}

export default PhantomAdapter;