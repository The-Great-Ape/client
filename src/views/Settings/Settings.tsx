import React, { useState, useEffect } from "react";
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useSession } from "../../contexts/session";
import User from '../../models/User';
import SettingsIcon from '@material-ui/icons/Settings';

export const SettingsView = () => {
  const [tab, setTab] = useState<number>(0);
  const { session, setSession } = useSession();
  const [discord, setDiscord] = useState(null);
  const isConnected = session && session.isConnected;
  const wallets = session && session.userWallets;
  const userId = session && session.userId;
  
  useEffect(() => {
    const discordId = session && session.discordId;
    setDiscord(discordId);
  }, [session]);


  const handleChange = (_event: any, newValue: number) => {
    setTab(newValue);
  };

  const unlinkDiscord = async () => {
    await User.updateUser(session, null);
    session.discordId = null;
    setSession(session);
    setDiscord(null);
  };

  return (
    <Container maxWidth="md" className="module">
      <Typography variant="h5" gutterBottom className="title">
        <SettingsIcon/> Settings
      </Typography>
      <br />
      <Paper className="tabs" elevation={4}>

        <AppBar position="static" color="primary" elevation={0}>
          <Tabs value={tab} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="Accounts" />
            <Tab label="Wallets" />
          </Tabs>
        </AppBar>

        {tab === 0 && <div>
          <TableContainer component={Paper} elevation={0}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Provider</TableCell>
                  <TableCell align="right">ID</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                <TableRow key={'discord'}>
                  <TableCell component="th" scope="row"><img src="/discord_icon.svg" className="media-icon" alt="discord"/> Discord</TableCell>
                  <TableCell align="right">{discord || <i>Not linked</i>}</TableCell>
                  <TableCell align="right">
                    {!discord && <a href={`${process.env.REACT_APP_API_URL}/discord?user_id=${userId}`}><Button color="primary" size="small" variant="contained">Link Discord</Button></a>}
                    {discord && <Button color="primary" size="small" variant="contained" onClick={unlinkDiscord}>Unlink Discord</Button>}
                  </TableCell>
                </TableRow>

                <TableRow key={'twitter'}>
                  <TableCell component="th" scope="row"><img src="/twitter_icon.svg" className="media-icon" alt="twitter"/> Twitter</TableCell>
                  <TableCell align="right"><i>Not linked</i></TableCell>
                  <TableCell align="right">
                    <Button color="primary" size="small" variant="contained" title="Connect" disabled>Coming Soon</Button>
                  </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </div>}

        {tab === 1 && <div>

          <TableContainer component={Paper} elevation={0}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Address</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wallets.map(wallet => {
                  return <TableRow key={'wallet1'}>
                    <TableCell component="th" scope="row">{wallet.address}</TableCell>
                    <TableCell align="right">
                      <Button color="primary" size="small" variant="contained" title="Connect" disabled>Primary</Button>
                    </TableCell>
                  </TableRow>
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>}
      </Paper>
    </Container>
  );
}
