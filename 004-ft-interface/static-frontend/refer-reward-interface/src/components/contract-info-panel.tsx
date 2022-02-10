import React, { memo } from "react";
import { useAtom } from "jotai";
import { Stack, StackProps, Flex, Spinner } from "@stacks/ui";

import { Title, Text, Caption } from "./typography";
import { border } from "../common/utils";
import { userAtom } from "../store/auth";
import { useGetTokenName } from "../common/hooks/use-get-token-name";
import { useGetTokenSymbol } from "../common/hooks/use-get-token-symbol";
import { useGetTokenDecimals } from "../common/hooks/use-get-token-decimals";
import { useGetTokenTotalSupply } from "../common/hooks/use-get-token-total-supply";
import { useGetTokenURI } from "../common/hooks/use-get-token-uri";

const SignedOutView: React.FC<StackProps> = ({ ...props }) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      spacing="loose"
      textAlign="center"
      {...props}
    >
      <Text maxWidth="24ch">Please connect your wallet first</Text>
    </Stack>
  );
};

const SignedInView: React.FC<StackProps> = ({ ...props }) => {
  const name = useGetTokenName();
  const symbol = useGetTokenSymbol();
  const decimals = useGetTokenDecimals();
  const total = useGetTokenTotalSupply();
  const uri = useGetTokenURI();
  return (
    <Stack justifyContent="center" flexGrow={1} spacing="loose" {...props}>
      <Text fontWeight={500}>
        Token name: <code>{name}</code>
      </Text>
      <Text fontWeight={500}>
        Token symbol: <code>{symbol}</code>
      </Text>
      <Text fontWeight={500}>
        Token decimal places: <code>{decimals}</code>
      </Text>
      <Text fontWeight={500}>
        Token total supply: <code>{total}</code> 
      </Text>
      <Text fontWeight={500}>
        Token uri: <code>{uri}</code>
      </Text>
    </Stack>
  );
};

export const ContractInfoPanel: React.FC = memo(() => {
  const [user] = useAtom(userAtom);
  return (
    <>
      <Stack
        position="absolute"
        p="loose"
        maxWidth="336px"
        borderRadius="24px"
        spacing="tight"
        width="100%"
      >
        <Title py="tight" variant="h2" textAlign="center">
          Token info
        </Title>
        <Caption textAlign="center">
          Read only function calls to get token details from contract deployed
          on testnet
        </Caption>
      </Stack>

      <Stack
        position="absolute"
        p="extra-loose"
        maxWidth="336px"
        border={border()}
        borderRadius="12px"
        spacing="extra-loose"
        minHeight="80%"
        width="100%"
      >
        {user ? (
          <React.Suspense
            fallback={
              <Flex
                alignItems="center"
                justifyContent="center"
                width="100%"
                flexGrow={1}
              >
                <Spinner size="24px" borderStyle="solid" />
              </Flex>
            }
          >
            <SignedInView />
          </React.Suspense>
        ) : (
          <SignedOutView />
        )}
      </Stack>
    </>
  );
});
