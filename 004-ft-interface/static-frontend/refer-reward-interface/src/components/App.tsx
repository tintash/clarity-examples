import React, { memo } from "react";
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, ColorModeProvider, Flex, color } from "@stacks/ui";
import { Connect } from "@stacks/connect-react";
import "../App.css";

import { useAuthOptions } from "../common/hooks/use-auth-options";
import { ContractInfoPanel } from "./contract-info-panel";
import { Header } from "./header";
import { ContractPanel } from "./contract-panel";
import { UserArea } from "./user-area";

const AppWrapper: React.FC = memo(({ children }) => {
  let authOptions = useAuthOptions();

  return (
    <ThemeProvider>
      <ColorModeProvider defaultMode="light">
        <Toaster position="bottom-center"/>
        <Connect authOptions={authOptions}>{children}</Connect>
      </ColorModeProvider>
    </ThemeProvider>
  );
});

function App() {
  return (
    <AppWrapper>
      <Flex
        bg={color("bg-4")}
        flexDirection="column"
        minHeight="100vh"
        Width="100vw"
        p="base"
      >
        <Flex
          bg={color("bg")}
          flexDirection="column"
          flexGrow={1}
          borderRadius="24px"
        >
          <Header />
          <UserArea />
          <Flex p="base" flexGrow={1}>
            <ContractInfoPanel />
            <ContractPanel />
          </Flex>
        </Flex>
      </Flex>
    </AppWrapper>
  );
}

export default App;
