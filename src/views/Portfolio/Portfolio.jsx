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
import { TokenAmount, lt } from '../../lib/token/safe-math';
import { getFarmByPoolId } from '../../lib/token/farms';

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

  //Get Balances RPC
  const fetchStaked = async () => {
      
    const body = {
        method: "getProgramAccounts",
        jsonrpc: "2.0",
        params: [
              "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
              {"commitment":"confirmed","filters":[{"memcmp":{"offset":40,"bytes":session.publicKey}},{"dataSize":96}],"encoding":"base64"}
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

  const fetchPairs = async () => {
    const response = await fetch("https://api.raydium.io/pairs", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const json = await response.json();
    return json;
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

  const fetchSOLBalance = async () => {
    const body = {
      method: "getBalance",
      jsonrpc: "2.0",
      params: [
        // Get the public key of the account you want the balance for.
        session.publicKey
      ],
      id: "35f0036a-3801-4485-b573-2bf29a7c77d2",
    };

    const response = await fetch("https://solana-api.projectserum.com/", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const json = await response.json();
    console.log(json);
    const resultValues = json.result.value
    return resultValues;
  };

  //Get Prices RPC
  const fetchPriceList = async () => {
    const response = await fetch("https://verify.grapes.network/prices.json", {
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

    let [portfolio, staked, sol, priceData, tokenMap, pairsData] = await Promise.all([fetchBalances(), fetchStaked(), fetchSOLBalance(), fetchPriceList(), fetchTokenMap(), fetchPairs()]);


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
    })


    if(sol){
        sol = parseFloat(new TokenAmount(sol, 9).format());
        const mint = 'So11111111111111111111111111111111111111112';
        var price = priceData.find(price => price.mint === mint);
        price = price && price.price;
        let tokenInfo = tokenMap.get(mint);
        tokenInfo.name = "SOL";

        portfolio.push({
            mint: mint,
            balance: sol,
            price,
            value: price * sol,
            tokenInfo: tokenInfo
        });
    }

    portfolio = portfolio.sort(function(a, b) {
        return b.value - a.value;
    });;

    //Parse
    staked = staked.map((stakeAccountInfo) => {
        const { data } = stakeAccountInfo.accountInfo
        const userStakeInfo = USER_STAKE_INFO_ACCOUNT_LAYOUT.decode(data)
        const poolId = userStakeInfo.poolId.toBase58()
        const farm = getFarmByPoolId(poolId);

        if(!farm) {
          return {
            balance: 0
          }
        }

        const pair = pairsData.find(pair => {
          return pair.name === farm.name
        });
        
        let balance = new TokenAmount(userStakeInfo.depositBalance.toNumber(), 6)
        balance = parseFloat(balance.format());

        let pendingReward = new TokenAmount(userStakeInfo.rewardDebt.toNumber(), 6);
        pendingReward = parseFloat(pendingReward.format());

        return {
            balance,
            pendingReward,
            tokenInfo: null,
            value : pair.price * balance,
            farmInfo: farm
        }
    }).filter((token) => {
        return token.balance > 0;
    });
    
    setBalances({
        portfolio,
        staked
    })

  };

  //Get Balances
  let total = 0;
  let portfolioTotal = 0; 
  let stakedTotal = 0;


  if(!balances){
    getBalances();
    return <div/>
  }else{   
    portfolioTotal = balances.portfolio.reduce((acc, token) => {
      return acc + token.value;
    }, 0);

    stakedTotal = balances.staked.reduce((acc, token) => {
        return acc + token.value;
    }, 0);

    total = portfolioTotal + stakedTotal;
  }

  return (
    <Container maxWidth="md">

        <div className="module">
        <Typography variant="h5" gutterBottom className="title">
        <AssessmentIcon /> Portfolio {`$${portfolioTotal.toFixed(2)}`}
      </Typography>
      <br />

      <Paper className="tabs" elevation={4}>
        <PortfolioTable balances={balances.portfolio}/>
      </Paper>
        </div>

   
        {(balances.staked && balances.staked.length) ? <div className="module">
            <Typography variant="h5" gutterBottom className="title">
            <AssessmentIcon /> Farms 
            </Typography>
            <br/>
            <Paper className="tabs" elevation={4}>
                <PortfolioTable balances={balances.staked} isFarm={true}/>
            </Paper>
        </div> : <div/>}
    </Container>
  );
};
