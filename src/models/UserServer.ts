import Session from './Session';

class UserServer {
    userServerId: string;
    userId: string;
    serverId: string;
    name: string;
    logo: string;

    constructor(data: any){
        this.userServerId = data.userServerId;
        this.userId = data.userId;
        this.serverId = data.serverId;
        this.name = data.name;
        this.logo = data.logo;
    }

    static async register(session: Session, serverId: string){
        try {
            if (!session) throw new Error('Invalid session');

            const token = session.token;
            const signature = token.signature;
            const address = token.address;
            const publicKey = session.publicKey;
            const userId = session.userId;

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
            const userServer = await response.json();
            return new UserServer(userServer);

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
            const userId = session.userId;

            const response = await fetch(`${process.env.REACT_APP_API_URL}/server/${serverId}/unregister`, {
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

            return true;
        } catch (err) {
            console.log(err);
        }
    }
}

export default UserServer;