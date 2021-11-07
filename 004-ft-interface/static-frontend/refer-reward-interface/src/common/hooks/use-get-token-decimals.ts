import { useAtomValue } from "jotai/utils";
import { tokenDecimalAtom } from "../../store/refer-reward";

export function useGetTokenDecimals() {
  return useAtomValue(tokenDecimalAtom(""));
}
