import React, { memo, useCallback } from "react";
import { useAtom } from "jotai";
import { Text, Stack } from "@stacks/ui";

import { Button } from "./button";
import { userAtom } from "../store/auth";
import { useUser } from "../common/hooks/use-user";
import { truncateMiddle } from "@stacks/ui-utils";
import { useUserSession } from "../common/hooks/use-usersession";
import { ConnectWalletButton } from "./connect-wallet-button";
import {
  useCurrentAddress,
  useCurrentMainnetAddress,
} from "../common/hooks/use-current-address";
import { useAccountNames } from "../common/hooks/use-account-names";
import { HiOutlineLogout } from "react-icons/hi";

const AccountNameComponent = memo(() => {
  const { user } = useUser();
  // Temporarily getting names from mainnet
  const address = useCurrentMainnetAddress();
  const testnetAddress = useCurrentAddress();
  const names = useAccountNames(address);
  const name = names?.[0];
  return (
    <Text mb="tight">
      {name || user?.username || truncateMiddle(testnetAddress)}
    </Text>
  );
});

const AccountDetails: React.FC = memo(() => {
  const { setUser } = useUser();
  const userSession = useUserSession();
  const testnetAddress = useCurrentAddress();
  const handleSignOut = useCallback(() => {
    userSession.signUserOut();
    void setUser(undefined);
  }, [userSession, setUser]);

  return (
    <Stack alignItems="center" flexGrow={1} spacing="loose" p="base" isInline>
      <Stack spacing="base-tight">
        <Button onClick={() => handleSignOut()}>
          <HiOutlineLogout />
          <Text marginLeft="8px" isInline>
            Logout
          </Text>{" "}
        </Button>
        <React.Suspense
          fallback={<Text mb="tight">{truncateMiddle(testnetAddress)}</Text>}
        >
          <AccountNameComponent />
        </React.Suspense>
      </Stack>
    </Stack>
  );
});

export const UserArea: React.FC = memo(() => {
  const [user] = useAtom(userAtom);

  return (
    <Stack
      position="absolute"
      top="extra-loose"
      right="extra-loose"
      zIndex={9999}
    >
      {user ? <AccountDetails /> : <ConnectWalletButton />}
    </Stack>
  );
});
