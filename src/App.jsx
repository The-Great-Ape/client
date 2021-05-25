import React, { useEffect, useState } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { WalletProvider } from "./contexts/wallet";
import { ConnectionProvider } from "./contexts/connection";
import { AccountsProvider } from "./contexts/accounts";
import { MarketProvider } from "./contexts/market";
import { HomeView, SettingsView } from "./views";
import Header from './components/Header/Header';
//import "./App.less";
import "./App.css";


function App() {
  return (
    <div className="main">
      <HashRouter basename={"/"}>
        <Header />
        <ConnectionProvider>
          <WalletProvider>
            <AccountsProvider>
              <MarketProvider>
                <Switch>
                  <Route exact path="/" component={() => <HomeView />} />
                  <Route exact path="/settings" children={<SettingsView />} />
                </Switch>
              </MarketProvider>
            </AccountsProvider>
          </WalletProvider>
        </ConnectionProvider>
      </HashRouter>
    </div>
  );
}

export default App;
