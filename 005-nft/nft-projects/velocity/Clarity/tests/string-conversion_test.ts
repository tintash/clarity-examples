import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v0.14.0/index.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

Clarinet.test({
  name: "Ensure that uint returns a string",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    var deployer = accounts.get("deployer")!;
    let block = chain.callReadOnlyFn(
      "string-conversion",
      "uint-to-string",
      [types.uint(1234)],
      deployer.address
    );
    assertEquals(block.result, '"1234"');
  },
});
