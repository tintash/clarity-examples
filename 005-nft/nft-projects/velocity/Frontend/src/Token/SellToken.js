import React, { useEffect, useState } from "react";
import { AppConfig, openContractCall, UserSession } from "@stacks/connect";
import {
  callReadOnlyFunction,
  createAssetInfo,
  cvToValue,
  makeStandardNonFungiblePostCondition,
  NonFungibleConditionCode,
  PostConditionMode,
  standardPrincipalCV,
  uintCV,
} from "@stacks/transactions";
import logo from "../velocity.svg";
import "./SellToken.css";
import * as constants from "../Constants";
import LoadImage from "../Storage/LoadImage";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

function GetUserProfile() {
  return userSession.loadUserData().profile.stxAddress;
}

function SellToken({ network }) {
  const [ownerTokens, setOwnerTokens] = useState(null);

  return (
    <div>
      <h1>Welcome to Token Trading Page</h1>
      <p>Here you can put your velocity for sale</p>
      <PutVelocityForSale ownerTokens={ownerTokens} network={network} />
      <GetOwnerNFTs
        ownerTokens={ownerTokens}
        setOwnerTokens={setOwnerTokens}
        network={network}
      />
    </div>
  );
}

function GetOwnerNFTs({ ownerTokens, setOwnerTokens, network }) {
  const profile = GetUserProfile();
  const ownerAddress = standardPrincipalCV(profile.testnet);

  useEffect(() => {
    const handleSubmit = async () => {
      const options = {
        contractAddress: constants.contractAddress,
        contractName: constants.velocityContract,
        functionName: constants.getTokens,
        functionArgs: [ownerAddress],
        network,
        senderAddress: profile.testnet,
      };
      try {
        const result = await callReadOnlyFunction(options);
        const response = cvToValue(result);
        console.log(response);
        setOwnerTokens(response);
      } catch (err) {
        console.log(err);
      }
    };
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <br />
      {ownerTokens?.length > 0 && <h1>You own {ownerTokens.length} tokens</h1>}
      {ownerTokens?.length > 0 &&
        ownerTokens.map((token) => {
          return (
            <div className="gallery">
              <LoadImage tokenId={token.value} />
              <div className="desc">Token ID: {token.value}</div>
            </div>
          );
        })}
    </div>
  );
}

function PutVelocityForSale({ ownerTokens, network }) {
  const profile = GetUserProfile();
  const [tokenId, setTokenId] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(10000);
  const [listOfTokens, setListOfTokens] = useState(ownerTokens);

  useEffect(() => {
    setListOfTokens(ownerTokens);
    if (ownerTokens?.length > 0) {
      setTokenId(ownerTokens[0].value);
    }
    console.log(ownerTokens);
  }, [ownerTokens]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Selling NFT");
    console.log("tokenId: " + tokenId);
    console.log("tokenPrice: " + tokenPrice);

    if (tokenPrice < 10000) {
      alert("Token Price too low");
      return;
    }

    const contractAddress = constants.contractAddress;
    const contractName = constants.velocityMarketContract;
    const functionName = constants.putVelocityForSale;
    const standardNFTPostCondition = makeStandardNonFungiblePostCondition(
      profile.testnet,
      NonFungibleConditionCode.DoesNotOwn,
      createAssetInfo(
        constants.assetAddress,
        constants.assetContractName,
        constants.assetName
      ),
      uintCV(tokenId)
    );
    const options = {
      contractAddress,
      contractName,
      functionName,
      functionArgs: [uintCV(tokenId), uintCV(tokenPrice)],
      appDetails: {
        name: constants.appName,
        icon: window.location.origin + logo,
      },
      network,
      userSession,
      postConditions: [standardNFTPostCondition],
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log("Stacks Transaction:", data.stacksTransaction);
        console.log("Transaction ID: 0x", data.txId);
        console.log("Raw transaction:", data.txRaw);
      },
    };

    await openContractCall(options);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setTokenId(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter Token Id:</label>
      <select name="selectedToken" value={tokenId} onChange={handleChange}>
        <option selected disabled>
          -Select From Tokens-
        </option>
        {listOfTokens?.length > 0
          ? listOfTokens.map((token) => <option>{token.value}</option>)
          : ""}
      </select>
      <br />
      <label>
        Enter Token Price (min 10000STX):
        <input
          type="number"
          value={tokenPrice}
          onChange={(s) => setTokenPrice(s.target.value)}
        />
      </label>
      {listOfTokens?.length > 0 && <button>Sale</button>}
    </form>
  );
}

export default SellToken;
