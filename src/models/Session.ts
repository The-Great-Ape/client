import UserWallet from './UserWallet';
import UserServer from './UserServer';
import Server from './Server';

export default class Session {
  userId: string;
  discordId: string;
  twitterId: string;
  userWallets: UserWallet[];
  servers: Server[];
  userServers: UserServer[];
  token: {
    signature: Buffer,
    address: Buffer,
  };
  publicKey: string;
  isConnected: Boolean;

  constructor(data: any) {
    this.userId = data && data.userId;
    this.discordId = data && data.discordId;
    this.twitterId = data && data.twitterId;
    this.userWallets = (data && data.userWallets) || [];
    this.userServers = (data && data.userServers) || [];
    this.servers = (data && data.servers) || [];
    this.isConnected = data && data.userId ? true : false;
    this.token = (data && data.token) || {signature: null, address: null};
    this.publicKey = data && data.publicKey;
  }
}