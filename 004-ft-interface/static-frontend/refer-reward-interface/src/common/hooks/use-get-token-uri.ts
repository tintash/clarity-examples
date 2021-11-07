import { useAtomValue } from "jotai/utils";
import { tokenURIAtom } from "../../store/refer-reward";

export function useGetTokenURI() {
  return useAtomValue(tokenURIAtom(""));
}
