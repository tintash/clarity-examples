import { useAtomValue } from "jotai/utils";
import { tokenTotalSupplyAtom } from "../../store/refer-reward";

export function useGetTokenTotalSupply() {
  return useAtomValue(tokenTotalSupplyAtom(""));
}
