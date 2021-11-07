import React from "react";
import { AppConfig, openContractCall, UserSession } from "@stacks/connect";
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  PostConditionMode,
} from "@stacks/transactions";
import "./Velocity.css";
import logo from "../velocity.svg";
import * as constants from "../Constants";
import BN from "bn.js";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

function GetUserProfile() {
  return userSession.loadUserData().profile.stxAddress;
}

function GetLastTokenId({ soldTokens }) {
  return (
    <div>
      <h2>Tokens sold: {soldTokens}</h2>
      <h2>{constants.totalTokens} Velocity NFTs to be claimed</h2>
    </div>
  );
}

function Claim({ freeTokens, network }) {
  const handleClaimForFree = async () => {
    const options = {
      contractAddress: constants.contractAddress,
      contractName: constants.velocityContract,
      functionName: constants.claim,
      functionArgs: [],
      appDetails: {
        name: constants.appName,
        icon: window.location.origin + logo,
      },
      network,
      postConditionCode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log("Stacks Transaction:", data.stacksTransaction);
        console.log("Transaction ID: 0x", data.txId);
        console.log("Raw transaction:", data.txRaw);
      },
    };
    await openContractCall(options);
  };

  const handleClaim = async () => {
    const profile = GetUserProfile();
    const tokenPrice = 10000;
    const stxPostCondition = makeStandardSTXPostCondition(
      profile.testnet,
      FungibleConditionCode.Equal,
      new BN(tokenPrice)
    );
    const options = {
      contractAddress: constants.contractAddress,
      contractName: constants.velocityContract,
      functionName: constants.claim,
      functionArgs: [],
      appDetails: {
        name: constants.appName,
        icon: window.location.origin + logo,
      },
      network,
      postCondtions: [stxPostCondition],
      postConditionCode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log("Stacks Transaction:", data.stacksTransaction);
        console.log("Transaction ID: 0x", data.txId);
        console.log("Raw transaction:", data.txRaw);
      },
    };
    await openContractCall(options);
  };
  return (
    <div>
      {freeTokens < constants.tokensForFree ? (
        <div>
          <h3>Only {freeTokens} remainng!</h3>
          <h3>Claim yours for free Today</h3>
          <button className="submit-button" onClick={handleClaimForFree}>
            Claim
          </button>
        </div>
      ) : (
        <div>
          <h3>
            Buy Velocity now! They cost as low as {constants.tokenCost} micro
            STX
          </h3>
          <button className="submit-button" onClick={handleClaim}>
            Claim
          </button>
        </div>
      )}
    </div>
  );
}

function GetTotalTokens({ ownerTokenBalance }) {
  return (
    <div>
      <h1>You own {ownerTokenBalance} tokens</h1>
    </div>
  );
}

export { GetLastTokenId, Claim, GetTotalTokens };
