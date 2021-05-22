import React, { useEffect, useState } from "react";
import { HomeView } from "./views"
import Header from './components/Header/Header';
//import "./App.less";
import "./App.css";
//import { Routes } from "./routes";

function App() {
  const [token, setToken] = useState(new URLSearchParams(document.location.search).get('token'));
  console.log('token', token)
  return (
    <div>
      <Header />
      <div className="main">
        <HomeView token={token}/>
      </div>
    </div>
  );
}

export default App;
