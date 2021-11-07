import React, { useState, useEffect } from "react";
import { AppConfig, UserSession } from "@stacks/connect";
import "./Home.css";
import { Claim, GetLastTokenId, GetTotalTokens } from "../Velocity/Velocity";
import { useHistory } from "react-router-dom";
import * as constants from "../Constants";
import {
  callReadOnlyFunction,
  cvToValue,
  standardPrincipalCV,
} from "@stacks/transactions";
import MySpinner from "../My-Spinner/MySpinner";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

function GetUserProfile() {
  return userSession.loadUserData().profile.stxAddress;
}

function Home({ network }) {
  const [freeTokens, setFreeTokens] = useState(0);
  const [soldTokens, setSoldTokens] = useState(0);
  const profile = GetUserProfile();
  const [ownerTokenBalance, setOwnerTokenBalance] = useState(0);
  const ownerAddress = standardPrincipalCV(profile.testnet);
  const [loading, setLoading] = useState(true);

  const setOptions = (funcName) => {
    return {
      contractAddress: constants.contractAddress,
      contractName: constants.velocityContract,
      functionName: funcName,
      functionArgs: funcName === constants.balanceOf ? [ownerAddress] : [],
      network: network,
      senderAddress: profile.testnet,
    };
  };

  useEffect(() => {
    const handleSubmit = async () => {
      const options = setOptions(constants.balanceOf);
      try {
        const result = await callReadOnlyFunction(options);
        const response = cvToValue(result);
        setOwnerTokenBalance(response);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    handleSubmit();
  }, []);

  useEffect(() => {
    async function handleSubmit() {
      const options = setOptions(constants.getLastTokenId);
      try {
        const result = await callReadOnlyFunction(options);
        const tokens = cvToValue(result.value);
        const freeTokens = constants.tokensForFree - tokens;
        setSoldTokens(tokens);
        console.log(`Free Tokens: ${freeTokens}`);
        setFreeTokens(freeTokens);
      } catch (err) {
        console.log(err);
      }
    }
    handleSubmit();
  }, []);

  const handleLogout = () => {
    userSession.signUserOut("/");
  };

  return (
    <div>
      <h1>Welcome</h1>
      <h4>Testnet: {profile.testnet}</h4>
      <h4>Mainnet: {profile.mainnet}</h4>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
      {loading ? null : (
        <GetTotalTokens
          ownerTokenBalance={ownerTokenBalance}
          network={network}
        />
      )}
      {loading ? (
        <MySpinner />
      ) : (
        <GetLastTokenId soldTokens={soldTokens} network={network} />
      )}
      {loading ? null : <Claim freeTokens={freeTokens} network={network} />}
      <br />
      <SellTokens />
      <br />
      <BuyTokens />
    </div>
  );
}

function SellTokens() {
  let history = useHistory();

  const handleSale = () => {
    history.push("/sell-token");
  };
  return (
    <div>
      <button className="sell" onClick={handleSale}>
        Sell Tokens
      </button>
    </div>
  );
}

function BuyTokens() {
  let history = useHistory();

  const handleBuy = () => {
    history.push("/buy-token");
  };
  return (
    <button className="buy" onClick={handleBuy}>
      Buy Tokens
    </button>
  );
}

export default Home;
