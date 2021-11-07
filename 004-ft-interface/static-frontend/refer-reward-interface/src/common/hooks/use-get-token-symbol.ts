import { useAtomValue } from "jotai/utils";
import { tokenSymbolAtom } from "../../store/refer-reward";

export function useGetTokenSymbol() {
  return useAtomValue(tokenSymbolAtom(""));
}
