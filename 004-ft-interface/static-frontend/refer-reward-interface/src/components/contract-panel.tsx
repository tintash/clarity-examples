import React, { memo } from "react";
import { useAtom } from "jotai";
import { Stack, Box, color, Button } from "@stacks/ui";

import Textarea from "react-textarea-autosize";
import { Caption, Text } from "./typography";
import { border } from "../common/utils";
import { userAtom } from "../store/auth";
import { AiOutlineDisconnect } from "react-icons/ai";
import { useLoading } from "../common/hooks/use-loading";
import { LOADING_KEYS } from "../store/ui";
import {
  useReferUserButton,
  usePerformTransaction,
  useUserPrincipalForm,
  useUserEmailForm,
} from "../common/hooks/use-refer-user";

const SignedOutView: React.FC = () => {
  return (
    <Stack
      position="relative"
      justifyContent="center"
      alignItems="center"
      top="loose"
      mx="auto"
      bg={color("bg")}
    >
      <AiOutlineDisconnect size="96px" />
    </Stack>
  );
};

const UserPrincipal: React.FC = () => {
  const { onChange } = useUserPrincipalForm();
  return (
    <Stack
      isInline
      border={border()}
      p="loose"
      alignItems="center"
      justifyContent="center"
      borderRadius="24px"
      as="form"
      mx="auto"
      position="relative"
      width="80%"
    >
      <Text justifyContent="center"> Principal: </Text>
      <Box
        onChange={onChange}
        color={color("text-caption")}
        as={Textarea}
        resize="none"
        border={0}
        outline={0}
        placeholder="ST1234..."
        width="100%"
        fontSize="17px"
        p="tight"
      />
    </Stack>
  );
};

const UserEmail: React.FC = () => {
  const { onChange } = useUserEmailForm();
  return (
    <Stack
      isInline
      border={border()}
      p="loose"
      alignItems="center"
      justifyContent="center"
      borderRadius="24px"
      as="form"
      mx="auto"
      position="relative"
      width="80%"
    >
      <Text justifyContent="center"> Email: </Text>
      <Box
        onChange={onChange}
        color={color("text-caption")}
        as={Textarea}
        resize="none"
        border={0}
        outline={0}
        placeholder="email@domain.com"
        width="100%"
        fontSize="17px"
        p="tight"
      />
    </Stack>
  );
};

const SignedInView: React.FC = () => {
  const { isLoading } = useLoading(LOADING_KEYS.REFER);
  const handleReferUserSend = useReferUserButton();
  const handleCompleteTransaction = usePerformTransaction();
  const { principalValue } = useUserPrincipalForm();
  const { emailValue } = useUserEmailForm();

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      position="relative"
      mx="auto"
      bg={color("bg")}
    >
      <Stack
        p="extra-loose"
        alignItems="center"
        mx="auto"
        position="relative"
        width="600px"
        height="50%"
        bg={color("bg")}
      >
        <Text fontWeight="bold"> Refer a new user </Text>
        <UserPrincipal />
        <UserEmail />
        <Button
          mt="loose"
          isLoading={isLoading}
          onClick={() => {
            handleReferUserSend(principalValue as string, emailValue as string);
          }}
        >
          Refer user
        </Button>
      </Stack>
      <Stack
        p="loose"
        alignItems="center"
        mx="auto"
        position="relative"
        width="600px"
        height="50%"
        bg={color("bg")}
      >
        <Text fontWeight="bold"> Complete a transaction </Text>
        <Caption maxWidth="50ch" textAlign="center">
          Referrer will get a token reward after new user performs certain
          number of transactions
        </Caption>
        <Button
          mt="loose"
          isLoading={isLoading}
          onClick={() => {
            handleCompleteTransaction();
          }}
        >
          Perform Transaction
        </Button>
      </Stack>
    </Stack>
  );
};

// AiOutlineDisconnect
export const ContractPanel: React.FC = memo(() => {
  const [user] = useAtom(userAtom);
  return user ? <SignedInView /> : <SignedOutView />;
});
