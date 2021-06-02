import Session from './Session';

class User {
    userId: string;
    discordId: string;
    twitterId: string;

    static async updateUser(session: Session, discordId: string) {
        try {
            if (!session) throw new Error('Invalid session');

            const token = session.token;
            const signature = token.signature;
            const address = token.address;
            const publicKey = session.publicKey;
            const userId = session.userId;

            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/` + userId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    address,
                    publicKey,
                    signature,
                    discordId
                })
            });

            return response;
        } catch (err) {
            console.log(err);
        }
    }
}

export default User;