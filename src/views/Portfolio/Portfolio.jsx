import React, { useEffect, useState } from "react";
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { useSession } from "../../contexts/session";
import AssessmentIcon from '@material-ui/icons/Assessment';
import PortfolioTable from './PortfolioTable';
import PortfolioChart from './PortfolioChart';


export const PortfolioView = () => {
  const [balances, setBalances] = useState(null);
  const [tokenMap, setTokenMap] = useState(new Map());
  const { session, setSession } = useSession();
  let portfolioTotal = 0;

  //Get Balances RPC
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

  //Get Prices RPC
  const fetchPriceList = async () => {
    const response = await fetch("https://price-api.sonar.watch/prices", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    return json;
  }

  const fetchTokenMap = async () => {
    let tokens = await new TokenListProvider().resolve();

    const tokenList = tokens.filterByClusterSlug('mainnet-beta').getList();

    let tokenMap = tokenList.reduce((map, item) => {
      map.set(item.address, item);
      return map;
    }, new Map());

    return tokenMap;
  }

  //Get Porfolio
  const getBalances = async () => {

    let priceData = await fetchPriceList();
    let balanceData = await fetchBalances();
    let tokenMap = await fetchTokenMap();

    const formattedData = balanceData.map((token) => {
      var mint = token.account.data.parsed.info.mint;
      var balance = token.account.data.parsed.info.tokenAmount.uiAmount;
      var price = priceData.find(price => price.mint === token.account.data.parsed.info.mint);

      return {
        mint: mint,
        balance: balance,
        price: price && price.price,
        value: price && price.price * balance,
        tokenInfo: mint && tokenMap.get(mint)
      };
    }).filter((token) => {
      return token.balance > 0 && typeof token.price !== "undefined";
    });

    setBalances(formattedData);
  };

  //Get Balances
  if(!balances){
    getBalances();
    
  }else{
    portfolioTotal = balances.reduce((acc, token) => {
      return acc + token.value;
    }, 0);
  }

  return (
    <Container maxWidth="md" className="main">
      <Typography variant="h5" gutterBottom className="title">
        <AssessmentIcon /> Portfolio {`$${portfolioTotal.toFixed(2)}`}
      </Typography>
      <br />

      <Paper className="tabs" elevation={4}>
        {/* <PortfolioChart balances={balances}/> */}
        <PortfolioTable balances={balances}/>
      </Paper>
    </Container>
  );
};
