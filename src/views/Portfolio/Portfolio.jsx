import React, { useEffect, useState } from "react";
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { useSession } from "../../contexts/session";
import AssessmentIcon from '@material-ui/icons/Assessment';
import PortfolioTable from './PortfolioTable';
import PortfolioChart from './PortfolioChart';
import { nu64, struct, u8, blob } from 'buffer-layout';
import { publicKey, u128, u64 } from '@project-serum/borsh'
import { TokenAmount, lt } from '../../lib/token/safe-math'

import {
    PublicKey,
  } from '@solana/web3.js'

  const USER_STAKE_INFO_ACCOUNT_LAYOUT = struct([
    u64('state'),
    publicKey('poolId'),
    publicKey('stakerOwner'),
    u64('depositBalance'),
    u64('rewardDebt')
  ])

  
export const PortfolioView = () => {
  const [balances, setBalances] = useState(null);
  const [tokenMap, setTokenMap] = useState(new Map());
  const { session, setSession } = useSession();
  let portfolioTotal = 0;

  //Get Balances RPC
  const fetchStaked = async () => {
      
    const body = {
        method: "getProgramAccounts",
        jsonrpc: "2.0",
        params: [
              "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
              {"commitment":"confirmed","filters":[{"memcmp":{"offset":40,"bytes":"FDw92PNX4FtibvkDm7nd5XJUAg6ChTcVqMaFmG7kQ9JP"}},{"dataSize":96}],"encoding":"base64"}
        ],
        id: "84203270-a3eb-4812-96d7-0a3c40c87a88"
      };
  
      const response = await fetch("https://solana-api.projectserum.com/", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      
      const json = await response.json();
      let decoded = json.result.map(({ pubkey, account: { data, executable, owner, lamports } }) => ({
        publicKey: new PublicKey(pubkey),
        accountInfo: {
          data: Buffer.from(data[0], 'base64'),
          executable,
          owner: new PublicKey(owner),
          lamports
        }}));

        return decoded;
  }


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

    let [priceData, portfolio, tokenMap, staked] = await Promise.all([fetchPriceList(), fetchBalances(), fetchTokenMap(), fetchStaked()]);

    //Parse portfolio
    portfolio = portfolio.map((token) => {
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

    //Parse
    staked = staked.map((stakeAccountInfo) => {
        const stakeAccountAddress = stakeAccountInfo.publicKey.toBase58()
        const { data } = stakeAccountInfo.accountInfo

        const userStakeInfo = USER_STAKE_INFO_ACCOUNT_LAYOUT.decode(data)
        const depositBalance = new TokenAmount(userStakeInfo.depositBalance.toNumber(), 6)
        const pendingReward = new TokenAmount(userStakeInfo.rewardDebt.toNumber(), 6);

        return {
            balance: parseFloat(depositBalance.format()),
            pendingReward: parseFloat(pendingReward.format()),
            tokenInfo: stakeAccountAddress
        }
    });
    
    setBalances({
        portfolio,
        staked
    })

  };

  //Get Balances
  if(!balances){
    getBalances();
    return <div/>
  }else{
    portfolioTotal = balances.portfolio.reduce((acc, token) => {
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
        <PortfolioTable balances={balances.portfolio}/>
      </Paper>
      <br />
      <br />

      <Typography variant="h5" gutterBottom className="title">
        <AssessmentIcon /> Farms 
      </Typography>
        <br/>
      <Paper className="tabs" elevation={4}>
        <PortfolioTable balances={balances.staked} isFarm={true}/>
      </Paper>
    </Container>
  );
};
