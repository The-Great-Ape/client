import React, { useEffect, useState } from "react";
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import { Link } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { Box, Circle } from "../../components";
import { useSession } from "../../contexts/session";
import User from "../../models/User";
import AssessmentIcon from '@material-ui/icons/Assessment';

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

const Icon = (props) => {
  const token = props.tokenMap.get(props.mint);
  if (!token || !token.logoURI) return null;

  return (
    <>
      <img style={{
        width: "28px",
        height: "28px"
      }} src={token.logoURI} />
      <span style={{ marginLeft: "20px" }}>
        {token.name}

      </span>
    </>
  );
};

export const PortfolioView = () => {
  const classes = useStyles2();
  const [portfolioTotal, setPortfolioTotal] = useState(0);
  const [balances, setBalances] = useState([]);
  const [tokenMap, setTokenMap] = useState(new Map());
  const [priceList, setPriceList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const { session, setSession } = useSession();

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, balances.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchBalances = async () => {
    const body = {
      method: "getTokenAccountsByOwner",
      jsonrpc: "2.0",
      params: [
        // Get the public key of the account you want the balance for.
        session.publicKey,
        { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
        { encoding: "jsonParsed", commitment: "processed" },
      ],
      id: "35f0036a-3801-4485-b573-2bf29a7c77d2",
    };
    const response = await fetch("https://solana-api.projectserum.com/", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    const resultValues = json.result.value
    return resultValues;
  };

  const fetchPriceList = async () => {
    const response = await fetch("https://price-api.sonar.watch/prices", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const json = await response.json();
      return json;
  }

  useEffect(() => {

    const fetchData = async () => {
      const priceData = await fetchPriceList();
      setPriceList(priceData);

      const balanceData = await fetchBalances();
      const formattedData = balanceData.map((token) => {
        var mint = token.account.data.parsed.info.mint;
        var balance = token.account.data.parsed.info.tokenAmount.uiAmount;
        var price = priceData.find(price => price.mint === token.account.data.parsed.info.mint);
        return {
          mint: mint,
          balance: balance,
          price: price && price.price,
          value: price && price.price * balance,
        };
      }).filter((token) => {
        return token.balance > 0 && typeof token.price !== "undefined";
      });
      console.log("here", formattedData);
      setBalances(formattedData);

      const portfolioTotal = formattedData.reduce((acc, token) => {
        return acc + token.value;
      }, 0);
      setPortfolioTotal(portfolioTotal);
    };

    if (session.publicKey) fetchData();

  }, []);

  useEffect(() => {
    new TokenListProvider().resolve().then(tokens => {
      const tokenList = tokens.filterByClusterSlug('mainnet-beta').getList();

      setTokenMap(tokenList.reduce((map, item) => {
        map.set(item.address, item);
        return map;
      }, new Map()));
    });
  }, [setTokenMap]);

  useEffect(() => {
  }, []);

  console.log("balances", balances);
  console.log("priceList", priceList);
  console.log("portfolioTotal", portfolioTotal);
  return (
    <Container maxWidth="md" className="main">
      <Typography variant="h5" gutterBottom className="title">
        <AssessmentIcon /> Portfolio {`$${portfolioTotal.toFixed(2)}`}
      </Typography>
      <br />

      <div className="tabs">
        <TableContainer component={Paper} elevation={0}>
          <Table className={classes.table} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ width: "60%" }}>
                  Asset
              </TableCell>
                <TableCell align="left" style={{ width: "20%" }}>
                  Balance
              </TableCell>
                <TableCell align="left" style={{ width: "5%" }}>
                  Price
              </TableCell>
                <TableCell align="right" style={{ width: "5%" }}>
                  Value
              </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? balances.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                : balances
              ).map((token, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Icon mint={token.mint} tokenMap={tokenMap} />
                  </TableCell>
                  <TableCell>{token.balance && token.balance.toFixed(2)}</TableCell>
                  <TableCell>{token.price && `$${token.price.toFixed(2)}`}</TableCell>
                  <TableCell>{token.value && `$${token.value.toFixed(2)}`}</TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={balances.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>

    </Container>
  );
};
