import { useCallback } from "react";
import { FinishedAuthData } from "@stacks/connect-react";
import { AuthOptions } from "@stacks/connect";

import { useUserSession } from "./use-usersession";
import { useLoading } from "./use-loading";
import { LOADING_KEYS } from "../../store/ui";
import { useUser } from "./use-user";

export function useAuthOptions() {
  const userSession = useUserSession();
  const { setIsLoading } = useLoading(LOADING_KEYS.AUTH);
  const { setUser } = useUser();

  const onFinish = useCallback(
    async ({ userSession }: FinishedAuthData) => {
      const userData = userSession?.loadUserData?.();
      await setUser(userData);
      void setIsLoading(false);
    },
    [setUser, setIsLoading]
  );
  const onCancel = useCallback(() => {
    void setIsLoading(false);
  }, [setIsLoading]);

  const authOptions: AuthOptions = {
    manifestPath: "/static/manifest.json",
    userSession,
    onFinish,
    onCancel,
    appDetails: {
      name: "stacks-auth",
      icon: "/icon.png",
    },
  };
  return authOptions;
}
