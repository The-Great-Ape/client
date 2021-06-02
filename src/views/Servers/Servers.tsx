import React, { useState, useEffect, useContext } from "react";
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
import { useSession } from "../../contexts/session";
import UserServer from '../../models/UserServer';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export const ServersView = (props: any) => {
  const [tab, setTab] = useState<number>(0);
  const { session, setSession } = useSession();

  const [servers, setServers] = useState([]);
  const [userServers, setUserServers] = useState([]);

  const isConnected = session && session.isConnected;

  const register = async (serverId: string) => {
    let userServer = await UserServer.register(session, serverId);
    session.userServers.push(userServer);
    setSession(session);
    setTab(0);
  };

  const unregister = async (serverId: string, index: number) => {
    let response = await UserServer.unregister(session, serverId);
    if (response) {
      let userServers = [...session.userServers];
      userServers.splice(index, 1);
      session.userServers = userServers;
      setSession(session);
      setUserServers(userServers);
      setServers(session.servers);
    }
  };

  const handleChange = (_event: any, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    let servers = session && session.servers;
    const userServers = session && session.userServers;

    if (servers && userServers) {
      let userServerIds = new Map();

      userServers.forEach(userServer => {
        userServerIds.set(userServer.serverId, true);
      });

      let newServers = servers.map(server => {
        server.registered = userServerIds.get(server.serverId) || false;

        return server;
      });

      setServers(newServers);
      setUserServers(userServers);
    }

  }, [session]);

  return (
    <Container maxWidth="md" className="main">
      <Typography variant="h5" gutterBottom className="title">
        Servers
      </Typography>
      <Divider variant="middle" />
      <br />

      <div className="tabs">

        <AppBar position="static" color="primary">
          <Tabs value={tab} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="Registered" />
            <Tab label="All" />
          </Tabs>
        </AppBar>

        {tab === 0 && <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ width: '1%' }}>Name</TableCell>
                <TableCell align="left" style={{ width: '70%' }}></TableCell>
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userServers.map((server, index) =>
                <TableRow key={'discord'}>
                  <TableCell ><img src={`/server-logos/${server.logo}`} alt="logo" className="logo-small" /></TableCell>
                  <TableCell  >{server.name}</TableCell>
                  <TableCell align="left">
                    <Button color="primary" size="small" variant="contained" onClick={() => unregister(server.serverId, index)}>Unregister</Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>}

        {tab === 1 && <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ width: '1%' }}>Name</TableCell>
                <TableCell align="left" style={{ width: '70%' }}></TableCell>
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servers.map(server =>
                <TableRow key={'discord'}>
                  <TableCell ><img src={`/server-logos/${server.logo}`} alt="logo" className="logo-small" /></TableCell>
                  <TableCell  >{server.name}</TableCell>
                  <TableCell align="left">
                    <Button color="primary" size="small" variant="contained" onClick={() => register(server.serverId)} disabled={server.registered}>Register</Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>}
      </div>
    </Container >
  );
}
