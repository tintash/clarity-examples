import { useAtomValue } from "jotai/utils";
import { tokenNameAtom } from "../../store/refer-reward";

export function useGetTokenName() {
  return useAtomValue(tokenNameAtom(""));
}
