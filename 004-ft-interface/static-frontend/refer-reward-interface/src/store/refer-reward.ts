import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { atomWithQuery } from "jotai/query";
import { cvToHex, cvToString, hexToCV } from "@stacks/transactions";
import { principalCV } from "@stacks/transactions/dist/clarity/types/principalCV";

import { smartContractsClientAtom } from "./api";
import {
  REFER_REWARD_CONTRACT,
  RR_TOKEN_NAME,
  RR_TOKEN_SYMBOL,
  RR_TOKEN_DECIMALS,
  RR_TOKEN_SUPPLY,
  RR_TOKEN_URI,
} from "../common/constants";

export const incrementAtom = atom(0);

export const userTokenBalanceAtom = atomFamily((address: string) =>
  atomWithQuery<string | null, string | null>((get) => ({
    queryKey: ["balance", address],
    refetchInterval: 5000,
    ...(defaultOptions as any),
    queryFn: async (): Promise<string | null> => {
      if (!address) return null;
      const client = get(smartContractsClientAtom);
      const [contractAddress, contractName] = REFER_REWARD_CONTRACT.split(".");
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: "get-balance-of",
        readOnlyFunctionArgs: {
          sender: address,
          arguments: [cvToHex(principalCV(address || ""))],
        },
      });
      if (data.okay && data.result) {
        return cvToString(hexToCV(data.result))
          .replace("(ok u", "")
          .replace(")", "");
      }
      return null;
    },
  }))
);

const defaultOptions = {
  refetchOnReconnect: true,
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  keepPreviousData: true,
};

export const tokenNameAtom = atomFamily(() =>
  atomWithQuery<null, null>((get) => ({
    queryKey: ["name"],
    ...(defaultOptions as any),
    queryFn: async (): Promise<string | null> => {
      const client = get(smartContractsClientAtom);
      const [contractAddress, contractName] = REFER_REWARD_CONTRACT.split(".");
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: RR_TOKEN_NAME,
        readOnlyFunctionArgs: {
          sender: contractAddress,
          arguments: [],
        },
      });
      if (data.okay && data.result) {
        return cvToString(hexToCV(data.result))
          .replace("(ok ", "")
          .replace(")", "");
      }
      return null;
    },
  }))
);

export const tokenSymbolAtom = atomFamily(() =>
  atomWithQuery<null, null>((get) => ({
    queryKey: ["symbol"],
    ...(defaultOptions as any),
    queryFn: async (): Promise<string | null> => {
      const client = get(smartContractsClientAtom);
      const [contractAddress, contractName] = REFER_REWARD_CONTRACT.split(".");
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: RR_TOKEN_SYMBOL,
        readOnlyFunctionArgs: {
          sender: contractAddress,
          arguments: [],
        },
      });
      if (data.okay && data.result) {
        return cvToString(hexToCV(data.result))
          .replace("(ok ", "")
          .replace(")", "");
      }
      return null;
    },
  }))
);

export const tokenDecimalAtom = atomFamily(() =>
  atomWithQuery<null, null>((get) => ({
    queryKey: ["decimals"],
    ...(defaultOptions as any),
    queryFn: async (): Promise<string | null> => {
      const client = get(smartContractsClientAtom);
      const [contractAddress, contractName] = REFER_REWARD_CONTRACT.split(".");
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: RR_TOKEN_DECIMALS,
        readOnlyFunctionArgs: {
          sender: contractAddress,
          arguments: [],
        },
      });
      if (data.okay && data.result) {
        return cvToString(hexToCV(data.result))
          .replace("(ok ", "")
          .replace(")", "");
      }
      return null;
    },
  }))
);

export const tokenTotalSupplyAtom = atomFamily(() =>
  atomWithQuery<null, null>((get) => ({
    queryKey: ["supply"],
    ...(defaultOptions as any),
    queryFn: async (): Promise<string | null> => {
      const client = get(smartContractsClientAtom);
      const [contractAddress, contractName] = REFER_REWARD_CONTRACT.split(".");
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: RR_TOKEN_SUPPLY,
        readOnlyFunctionArgs: {
          sender: contractAddress,
          arguments: [],
        },
      });
      if (data.okay && data.result) {
        return cvToString(hexToCV(data.result))
          .replace("(ok ", "")
          .replace(")", "");
      }
      return null;
    },
  }))
);

export const tokenURIAtom = atomFamily(() =>
  atomWithQuery<null, null>((get) => ({
    queryKey: ["uri"],
    ...(defaultOptions as any),
    queryFn: async (): Promise<string | null> => {
      const client = get(smartContractsClientAtom);
      const [contractAddress, contractName] = REFER_REWARD_CONTRACT.split(".");
      const data = await client.callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: RR_TOKEN_URI,
        readOnlyFunctionArgs: {
          sender: contractAddress,
          arguments: [],
        },
      });
      if (data.okay && data.result) {
        return cvToString(hexToCV(data.result))
          .replace("(ok (some u", "")
          .replace("))", "");
      }
      return null;
    },
  }))
);
