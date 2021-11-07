import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import WithSpinner from "./with-spinner/WithSpinner";
import "./App.css";
import Authentication from "./Authentication/Authentication";
import Home from "./Home/Home";
import SellToken from "./Token/SellToken";
import BuyToken from "./Token/BuyToken.js";
import { StacksTestnet, StacksMocknet } from "@stacks/network";
// const HomeWithSpinner = WithSpinner(Home);
const useMocknet = false;

function App() {
  // const [loading, setLoading] = useState(true);
  const network = useMocknet ? new StacksMocknet() : new StacksTestnet();

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Authentication} />
          <Route path="/home">
            <Home network={network} />
          </Route>
          <Route path="/sell-token">
            <SellToken network={network} />
          </Route>
          <Route path="/buy-token">
            <BuyToken network={network} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
