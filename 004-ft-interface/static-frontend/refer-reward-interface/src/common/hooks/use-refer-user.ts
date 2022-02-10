import React, { useCallback } from "react";
import { toast } from "react-hot-toast";
import { atom, useAtom } from "jotai";
import { useConnect } from "@stacks/connect-react";
import { principalCV } from "@stacks/transactions/dist/clarity/types/principalCV";
import { stringAsciiCV } from "@stacks/transactions";

import { useLoading } from "./use-loading"; 
import { useNetwork } from "./use-network";
import { useCurrentAddress } from "./use-current-address";
import {
  RR_REFER_USER,
  REFER_REWARD_CONTRACT,
  RR_PERFORM_TRANSACTION,
} from "../constants";
import { LOADING_KEYS } from "../../store/ui";

export const userPrincipalAtom = atom("");
export const userEmailAtom = atom("");

export function useUserPrincipalForm() {
  const [principalValue, setPrincipalValue] = useAtom<string, string>(
    userPrincipalAtom
  );

  const onChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      setPrincipalValue(event.currentTarget.value);
    },
    [setPrincipalValue]
  );

  return {
    principalValue,
    onChange,
  };
}

export function useUserEmailForm() {
  const [emailValue, setEmailValue] = useAtom<string, string>(userEmailAtom);

  const onChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      setEmailValue(event.currentTarget.value);
    },
    [setEmailValue]
  );

  return {
    emailValue,
    onChange,
  };
}

export function useReferUserButton() {
  const address = useCurrentAddress();
  const [contractAddress, contractName] = REFER_REWARD_CONTRACT.split(".");
  const { setIsLoading } = useLoading(LOADING_KEYS.REFER);
  const { doContractCall } = useConnect();

  // const
  const network = useNetwork();

  const onCancel = useCallback(() => {
    toast.error("Cancelled!");
    void setIsLoading(false);
  }, [setIsLoading]);

  const onFinish = useCallback(() => {
    toast.success("Transaction sent!");
    void setIsLoading(false);
  }, [setIsLoading]);

  return useCallback(
    (userAddress: string, email: string) => {
      
      if (!userAddress || !email) {
        toast.error("input required!");
        return null;
      }
      
      if ((!userAddress.startsWith("SP")) && (!userAddress.startsWith("ST"))) {
        toast.error("invalid principal value!");
        console.log (userAddress, userAddress.length);
        return null;
      }

      if (userAddress.length >= 128) {
        toast.error("invalid principal length");
        console.log (userAddress, userAddress.length);
        return null;
      }

      // verify principal conversion
      try {
        principalCV(userAddress || "");
      } catch (error) {
        toast.error("invalid principal value!");
        return null;
      }

      const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!reg.test(email.toLowerCase())) {
        toast.error("invalid email");
        return null;
      }
      void setIsLoading(true);

      void doContractCall({
        contractAddress,
        contractName,
        functionName: RR_REFER_USER,
        functionArgs: [principalCV(userAddress || "")],
        onFinish,
        onCancel,
        network,
        stxAddress: address,
      });
    },
    [network, onFinish, onCancel, address, doContractCall, contractAddress, contractName, setIsLoading]
  );
}

export function usePerformTransaction() {
  const address = useCurrentAddress();
  const [contractAddress, contractName] = REFER_REWARD_CONTRACT.split(".");
  const { setIsLoading } = useLoading(LOADING_KEYS.REFER);
  const { doContractCall } = useConnect();

  const network = useNetwork();

  const onCancel = useCallback(() => {
    toast.error("Cancelled!");
    void setIsLoading(false);
  }, [setIsLoading]);

  const onFinish = useCallback(() => {
    toast.success("Transaction sent!");
    void setIsLoading(false);
  }, [setIsLoading]);

  return useCallback(() => {
    void setIsLoading(true);

    void doContractCall({
      contractAddress,
      contractName,
      functionName: RR_PERFORM_TRANSACTION,
      functionArgs: [],
      onFinish,
      onCancel,
      network,
      stxAddress: address,
    });
  }, [network, onFinish, onCancel, address, doContractCall, contractAddress, contractName, setIsLoading]);
}
