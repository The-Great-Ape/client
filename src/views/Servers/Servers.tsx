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
import { useSession } from "../../contexts/session";

export const ServersView = () => {
  const { session, setSession } = useSession();
  const isConnected = session && session.isConnected;
  
  return (
    <Container maxWidth="md" className="main">
      <Typography variant="h5" gutterBottom className="title">
        Servers
      </Typography>
      <Divider variant="middle" />
      <br />
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{width:'1%'}}>Name</TableCell>
                <TableCell align="left"style={{width:'70%'}}></TableCell>
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={'discord'}>
                <TableCell ><img src="/logo.png" alt="logo" className="logo-small"/></TableCell>
                <TableCell > Great Ape</TableCell>
                <TableCell align="left">
                  <a href="http://localhost:4000/discord"><Button color="primary" size="small" variant="contained" title="Connect">Register</Button></a>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
    </Container>
  );
}
