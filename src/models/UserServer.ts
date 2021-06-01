import Session from './Session';

class UserServer {
    userServerId: string;
    userId: string;
    serverId: string;

    constructor(data: any){
        this.userServerId = data.userServerId;
        this.userId = data.userId;
        this.serverId = data.serverId;
    }

    static async register(session: Session, serverId: string){
        try {
            if (!session) throw new Error('Invalid session');

            const token = session.token;
            const signature = token.signature;
            const address = token.address;
            const publicKey = session.publicKey;
            const userId = session.user && session.user.userId;

            const response = await fetch(`${process.env.REACT_APP_API_URL}/server/${serverId}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    address,
                    publicKey,
                    signature,
                    userId
                })
            });

            return new UserServer(response);
        } catch (err) {
            console.log(err);
        }
    }

    static async unregister(session: Session, serverId: string){
        try {
            if (!session) throw new Error('Invalid session');

            const token = session.token;
            const signature = token.signature;
            const address = token.address;
            const publicKey = session.publicKey;
            const userId = session.user && session.user.userId;

            const response = await fetch(`${process.env.REACT_APP_API_URL}/server/${serverId}/unregister`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    address,
                    publicKey,
                    signature,
                    userId
                })
            });

            return new UserServer(response);
        } catch (err) {
            console.log(err);
        }
    }
}

export default UserServer;