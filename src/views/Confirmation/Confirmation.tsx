import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Box, Circle } from '../../components';
import { useSession } from "../../contexts/session";
import User from '../../models/User';
import './Confirmation.less';

function getParam(param: string) {
    return new URLSearchParams(document.location.search).get(param);
}

export const ConfirmationView = () => {
    const [avatar, setAvatar] = React.useState(getParam('avatar'));
    const [discordId, setDiscordId] = React.useState(getParam('discord_id'));
    const [provider, setProvider] = React.useState(getParam('provider'));
    const { session, setSession } = useSession();

    if (session && discordId && session.discordId !== discordId) {
        User.updateUser(session, discordId);
        session.discordId = discordId;
        setSession(session);
    }

    return (
        <Container maxWidth="md" className="confirmation">
            <Box>
                <div className="title">
                    <Typography variant="h5" gutterBottom>
                        {provider} linked!
                    </Typography>
                </div>

                <div className="overlap">
                    <Circle padding={true}><img src="/grape_logo.svg" alt="grape-logo" /></Circle>
                    <Circle padding={false}>
                        {provider === 'discord' && <img src={`https://cdn.discordapp.com/avatars/${discordId}/${avatar}?size=512`} alt="avatar" />}
                    </Circle>
                </div>

                <br />
                <Link to='/'><Button color="primary" size="medium" variant="contained" title="Connect">Home</Button></Link>
            </Box>
        </Container>
    );
}
