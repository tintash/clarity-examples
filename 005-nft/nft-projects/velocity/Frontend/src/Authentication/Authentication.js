import React, { useEffect, useState } from "react";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { useHistory } from "react-router-dom";
import logo from "../velocity.svg";
import "./Authentication.css";
import * as constants from "../Constants";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

function Authentication() {
  const [testnet, setTestnet] = useState("");
  const [mainnet, setMainnet] = useState("");
  let history = useHistory();

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        console.log("handlePendingSignIn: " + userData);
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      console.log("already signed in");
      const userData = userSession.loadUserData();
      setUserData(userData);
    } else {
      console.log("signed out");
    }
  }, []);

  useEffect(() => {
    if (testnet !== "" && mainnet !== "") {
      history.push("/home", { testnet: testnet, mainnet: mainnet });
    }
  }, [history, testnet, mainnet]);

  const handleLogin = () => {
    showConnect({
      appDetails: {
        name: constants.appName,
        icon: window.location.origin + logo,
      },
      redirectTo: "/home",
      onFinish: () => {
        const userData = userSession.loadUserData();
        setUserData(userData);
      },
      userSession: userSession,
    });
  };

  const setUserData = (userData) => {
    const profile = userData.profile.stxAddress;
    setTestnet(profile.testnet);
    setMainnet(profile.mainnet);
  };

  return (
    <div>
      <h1>Welcome to Velocity Market</h1>
      <h3>
        In this marketplace, you can buy Velocity from your STX and become the
        first ones to own it
      </h3>
      <button className="login" onClick={handleLogin}>
        Login
      </button>
      <br />
      <br />
      <i>
        Note: You need a hiro wallet extension to login. Download it from{" "}
        <a href="https://www.hiro.so/wallet/install-web">here</a>
        <br />
        You might also need to get STX from faucet on Testnet network. Get it
        from <a href="https://explorer.stacks.co/sandbox/faucet">here</a>
      </i>
    </div>
  );
}

export default Authentication;
