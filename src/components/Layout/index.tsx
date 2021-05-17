import React from "react";
import "./../../App.less";
import { Layout, Menu, Breadcrumb } from "antd";
import { Link } from "react-router-dom";

import { LABELS } from "../../constants";
import { AppBar } from "../AppBar";

const { Header, Content } = Layout;

export const AppLayout = React.memo((props: any) => {
  return (
    <div className="App wormhole-bg">
      <Layout title={LABELS.APP_TITLE}>
        <Header className="App-Bar">
          <div style={{width: 200}}>
            <div className="logo" >
              <img src="/logo.png" alt="logo" className="header-logo" />
            </div>
            <Link to="/">
              <div className="app-title">
                <h2>Great Ape</h2>
              </div>
            </Link>
          </div>

          <AppBar />
        </Header>
        <Content style={{ padding: "0 50px" }}>{props.children}</Content>
      </Layout>
    </div>
  );
});
