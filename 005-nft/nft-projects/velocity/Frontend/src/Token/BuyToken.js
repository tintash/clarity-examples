import React, { useState } from "react";
import { AppConfig, openContractCall, UserSession } from "@stacks/connect";
import {
  callReadOnlyFunction,
  createAssetInfo,
  cvToValue,
  FungibleConditionCode,
  makeContractNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  NonFungibleConditionCode,
  PostConditionMode,
  uintCV,
} from "@stacks/transactions";
import "./BuyToken.css";
import * as constants from "../Constants";
import logo from "../velocity.svg";
import BN from "bn.js";
import MySpinner from "../My-Spinner/MySpinner";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

function GetUserProfile() {
  return userSession.loadUserData().profile.stxAddress;
}

function BuyToken({ network }) {
  return (
    <div>
      <h1>Welcome to Token Trading Page</h1>
      <p>Here you can buy velocity</p>
      <GetNFTsForSale network={network} />
    </div>
  );
}

function GetNFTsForSale({ network }) {
  const profile = GetUserProfile();
  const [tokenId, setTokenId] = useState(0);
  const [tokenSeller, setTokenSeller] = useState("");
  const [tokenPrice, setTokenPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const options = {
      contractAddress: constants.contractAddress,
      contractName: constants.velocityMarketContract,
      functionName: constants.getVelocityForSale,
      functionArgs: [uintCV(tokenId)],
      network,
      senderAddress: profile.testnet,
    };

    try {
      const result = await callReadOnlyFunction(options);
      const response = cvToValue(result);
      if (response == null) {
        setTokenPrice(0);
        setTokenSeller("");
      } else {
        setTokenPrice(response.value.price.value);
        setTokenSeller(response.value.seller.value);
      }
    } catch (err) {
      console.log(err);
    }
    try {
      const result = await callReadOnlyFunction(options);
      const response = cvToValue(result);
      if (response == null) {
        setTokenPrice(0);
        setTokenSeller("");
      } else {
        setTokenPrice(response.value.price.value);
        setTokenSeller(response.value.seller.value);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Token Id:
          <input
            type="number"
            value={tokenId}
            onChange={(s) => setTokenId(s.target.value)}
          />
        </label>
        <button type="submit">Check</button>
      </form>
      <br />
      {tokenSeller !== "" ? (
        loading ? (
          <MySpinner />
        ) : (
          <div>
            {tokenSeller === profile.testnet ? (
              <h1>You cannot buy your own tokens!</h1>
            ) : (
              <BuyVelocity
                tokenId={tokenId}
                tokenPrice={tokenPrice}
                tokenSeller={tokenSeller}
                network={network}
              />
            )}
          </div>
        )
      ) : (
        <div>
          <h1>This NFT is not available for sale</h1>
        </div>
      )}
    </>
  );
}

function BuyVelocity(props) {
  const profile = GetUserProfile();
  const tokenId = props.tokenId;
  const tokenPrice = props.tokenPrice;
  const tokenSeller = props.tokenSeller;
  console.log(tokenSeller === profile.testnet);

  const handleSubmit = async (e) => {
    console.log("TokenID: " + tokenId);
    console.log("TokenPrice: " + tokenPrice);
    console.log("TokenSeller: " + tokenSeller);

    const contractAddress = constants.contractAddress;
    const contractName = constants.velocityMarketContract;
    const functionName = constants.buyVelocity;
    const nftTransferPostCondition = makeContractNonFungiblePostCondition(
      contractAddress,
      contractName,
      NonFungibleConditionCode.DoesNotOwn,
      createAssetInfo(
        constants.assetAddress,
        constants.assetContractName,
        constants.assetName
      ),
      uintCV(tokenId)
    );
    const stxPostCondition = makeStandardSTXPostCondition(
      profile.testnet,
      FungibleConditionCode.Equal,
      new BN(tokenPrice)
    );

    const options = {
      contractAddress,
      contractName,
      functionName,
      functionArgs: [uintCV(tokenId)],
      appDetails: {
        name: constants.appName,
        icon: window.location.origin + logo,
      },
      network: props.network,
      userSession,
      postConditions: [nftTransferPostCondition, stxPostCondition],
      postConditionMode: PostConditionMode.Deny,
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
      <h1>This NFT is available for sale.</h1>
      <h2>Price: {tokenPrice}</h2>
      <h2>Seller: {tokenSeller}</h2>
      <button onClick={handleSubmit}>Buy Velocity</button>
    </div>
  );
}

export default BuyToken;
