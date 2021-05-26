import React, { useEffect, useState } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { SessionProvider } from "./contexts/session";
import { HomeView, ServersView, SettingsView, ConfirmationView } from "./views";
import Header from './components/Header/Header';
import "./App.less";

function App() {
  return (
    <div className="main">
      <HashRouter basename={"/"}>
        <SessionProvider>
          <Header />
          <Switch>
            <Route exact path="/" component={() => <HomeView />} />
            <Route exact path="/servers" children={<ServersView />} />
            <Route exact path="/settings" children={<SettingsView />} />           
            <Route exact path="/confirmation" children={<ConfirmationView />} />
          </Switch>
        </SessionProvider>
      </HashRouter>
    </div>
  );
}

export default App;
