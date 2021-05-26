import React from "react";
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
import Box from '../../components/Box/Box';

export const SettingsView = () => {
  const [tab, setTab] = React.useState<number>(0);
  const { session, setSession } = useSession();
  const isConnected = session && session.isConnected;
  const wallets = session && session.wallets;
  const user = session && session.user;
  const discordId = user && user.discordId;
  const userId = user && user.userId;

  const handleChange = (_event: any, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Container maxWidth="md" className="main">
      <Typography variant="h5" gutterBottom className="title">
        Settings
      </Typography>
      <Divider variant="middle" />
      <br />
     <div className="tabs">

        <AppBar position="static" color="primary">
          <Tabs value={tab} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="Accounts" />
            <Tab label="Wallets" />
          </Tabs>
        </AppBar>

        {tab === 0 && <div>
          <TableContainer component={Paper}>
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
                  <TableCell component="th" scope="row"> Discord</TableCell>
                  <TableCell align="right">{discordId || <i>Not linked</i>}</TableCell>
                  <TableCell align="right">
                    <a href={`http://localhost:4000/discord?user_id=${userId}`}><Button color="primary" size="small" variant="contained" title="Connect">{discordId ? 'Unlink Discord' : 'Link Discord'}</Button></a>
                  </TableCell>
                </TableRow>

                <TableRow key={'twitter'}>
                  <TableCell component="th" scope="row">Twitter</TableCell>
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

          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Address</TableCell>
                  <TableCell align="right">Provider</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wallets.map(wallet => {
                  return <TableRow key={'wallet1'}>
                    <TableCell component="th" scope="row">{wallet.address}</TableCell>
                    <TableCell align="right">Sollet</TableCell>
                    <TableCell align="right">
                      <Button color="primary" size="small" variant="contained" title="Connect">Remove</Button>
                    </TableCell>
                  </TableRow>
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>}
      </div>
    </Container>
  );
}
