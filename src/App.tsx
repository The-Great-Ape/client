import React, { useEffect } from "react";
import { HomeView } from "./views"
import Header from './components/Header/Header';
//import "./App.less";
import "./App.css";
//import { Routes } from "./routes";

function App() {
  useEffect(() => {
    console.log('App started');
  }, []);
  return (
    <div>
      <Header />
      <div className="main">
        <HomeView />
      </div>
    </div>
  );
}

export default App;
