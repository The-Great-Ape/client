import { Button, Col, Row } from "antd";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "../../components/ConnectButton";
import { TokenIcon } from "../../components/TokenIcon";
import { useConnectionConfig } from "../../contexts/connection";
import { useMarkets } from "../../contexts/market";
import { useUserBalance, useUserTotalBalance } from "../../hooks";
import { WRAPPED_SOL_MINT } from "../../utils/ids";
import { formatUSD } from "../../utils/utils";
import { Card } from 'antd';

export const HomeView = () => {
  const { marketEmitter, midPriceInUSD } = useMarkets();
  const { tokenMap } = useConnectionConfig();
  const SRM_ADDRESS = 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt';
  const SRM = useUserBalance(SRM_ADDRESS);
  const SOL = useUserBalance(WRAPPED_SOL_MINT);
  const { balanceInUSD: totalBalanceInUSD } = useUserTotalBalance();

  useEffect(() => {
    const refreshTotal = () => { };

    const dispose = marketEmitter.onMarket(() => {
      refreshTotal();
    });

    refreshTotal();

    return () => {
      dispose();
    };
  }, [marketEmitter, midPriceInUSD, tokenMap]);

  return (
    <Row gutter={[16, 16]}>
      <Col span={24} style={{marginTop:50}}>
        <Card title="Wallet" bordered={true} style={{
          width: 300,
          margin: "0 auto"
        }}>

          <h2>Your balances ({formatUSD.format(totalBalanceInUSD)}):</h2>
          <h2>SOL: {SOL.balance} ({formatUSD.format(SOL.balanceInUSD)})</h2>
          <h2 style={{ display: 'inline-flex', alignItems: 'center' }}>
            <TokenIcon mintAddress={SRM_ADDRESS} /> SRM: {SRM?.balance} ({formatUSD.format(SRM?.balanceInUSD)})
        </h2>
        </Card>
      </Col>
    </Row>
  );
};
