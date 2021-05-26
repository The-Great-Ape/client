import UserWallet from './UserWallet';
import User from './User';

export default interface Session {
    user: User,
    wallets: UserWallet[],
    token: {
      signature: Buffer,
      address: Buffer,
    },
    publicKey: string,
    isConnected: Boolean
  }