import UserWallet from './UserWallet';
import UserServer from './UserServer';
import User from './User';
import Server from './Server';

export default interface Session {
    user: User,
    wallets: UserWallet[],
    servers: Server[],
    userServers: UserServer[],
    token: {
      signature: Buffer,
      address: Buffer,
    },
    publicKey: string,
    isConnected: Boolean
  }