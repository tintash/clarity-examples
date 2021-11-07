import {
  callReadOnlyFunction,
  makeContractCall,
  cvToJSON,
  stringAsciiCV,
  standardPrincipalCV,
  broadcastTransaction,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";

import { mnemonicToSeedSync } from "bip39";
import { fromSeed } from "bip32";
import blockstack from "blockstack";
import * as bitcoin from "bitcoinjs-lib";

const network = new StacksTestnet();
var mnemonic =
  "inside claim kick easily assist trim cat silk culture pumpkin drastic claim tail bleak journey lunar nose apple result draw fiscal present unlock evil";

import {
  REFER_REWARD_CONTRACT,
  RR_TOKEN_NAME,
  RR_TOKEN_SYMBOL,
  RR_TOKEN_DECIMALS,
  RR_TOKEN_SUPPLY,
  RR_TOKEN_URI,
  RR_REFER_USER,
  RR_PERFORM_TRANSACTION,
} from "./constants";

async function makeReadOnlyCall(functionName) {
  const [contractAddress, contractName] = REFER_REWARD_CONTRACT.split(".");
  const data = await callReadOnlyFunction({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: functionName,
    functionArgs: [],
    network,
    senderAddress: contractAddress,
  });
  return data;
}

export async function getTokenName() {
  const data = await makeReadOnlyCall(RR_TOKEN_NAME);
  return cvToJSON(data).value.value;
}

export async function getTokenSymbol() {
  const data = await makeReadOnlyCall(RR_TOKEN_SYMBOL);
  return cvToJSON(data).value.value;
}

export async function getTokenDecimals() {
  const data = await makeReadOnlyCall(RR_TOKEN_DECIMALS);
  return cvToJSON(data).value.value;
}

export async function getTokenSupply() {
  const data = await makeReadOnlyCall(RR_TOKEN_SUPPLY);
  return cvToJSON(data).value.value;
}

export async function getTokenURI() {
  const data = await makeReadOnlyCall(RR_TOKEN_URI);
  return cvToJSON(data).value.value.value;
}

export function setMnemonic(secret) {
  mnemonic = secret;
  return mnemonic;
}

export async function referUser(req) {
  const newUserAddress = standardPrincipalCV(req.query.useraddress);
  const newUserEmail = stringAsciiCV(req.query.useremail);

  const seed = mnemonicToSeedSync(mnemonic);
  const master = fromSeed(seed);
  const child = master.derivePath("m/44'/5757'/0'/0/0");
  const ecPair = bitcoin.ECPair.fromPrivateKey(child.privateKey);
  const privkey = blockstack.ecPairToHexString(ecPair);

  const [contractAddress, contractName] = REFER_REWARD_CONTRACT.split(".");
  const transaction = await makeContractCall({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: RR_REFER_USER,
    functionArgs: [newUserEmail, newUserAddress],
    senderKey: privkey,
    validateWithAbi: true,
    network,
  });

  const result = await broadcastTransaction(transaction, network);
  return JSON.stringify(result);
}

export async function completeTransaction() {
  const seed = mnemonicToSeedSync(mnemonic);
  const master = fromSeed(seed);
  const child = master.derivePath("m/44'/5757'/0'/0/0");
  const ecPair = bitcoin.ECPair.fromPrivateKey(child.privateKey);
  const privkey = blockstack.ecPairToHexString(ecPair);

  const [contractAddress, contractName] = REFER_REWARD_CONTRACT.split(".");
  const transaction = await makeContractCall({
    contractAddress: contractAddress,
    contractName: contractName,
    functionName: RR_PERFORM_TRANSACTION,
    functionArgs: [],
    senderKey: privkey,
    validateWithAbi: true,
    network,
  });

  const result = await broadcastTransaction(transaction, network);
  return JSON.stringify(result);
}
