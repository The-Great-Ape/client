import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { SessionProvider } from "./contexts/session";
import {
  HomeView,
  ServersView,
  SettingsView,
  ConfirmationView,
  RegisterView,
} from "./views";
import Header from "./components/Header/Header";

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
            <Route exact path="/register" children={<RegisterView />} />
            <Route component={() => <HomeView />} />
          </Switch>
        </SessionProvider>
      </HashRouter>
    </div>
  );
}

export default App;
