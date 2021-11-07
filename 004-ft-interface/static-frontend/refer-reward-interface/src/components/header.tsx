import { memo } from "react";
import { Stack, StackProps } from "@stacks/ui";
import { FaBitcoin } from "react-icons/fa";
import { Title } from "./typography";

export const Header = memo((props: StackProps) => (
  <>
    <Stack
      top="extra-loose"
      position="relative"
      p="base"
      alignItems="center"
      justifyContent="center"
      isInline
      {...props}
    >
      <Title>
        Referral Reward Tokens <FaBitcoin />
      </Title>
    </Stack>
  </>
));
