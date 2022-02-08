
// @ts-ignore
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
// @ts-ignore
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "refer-reward-ft -- transfer tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let eCaller = accounts.get('deployer')!;
        let eWallet1 = accounts.get('wallet_1')!;
        const tokens = 10;
        let block = chain.mineBlock([
            Tx.contractCall ('refer-reward-ft', 'transfer', 
                [types.uint(tokens), types.principal(eCaller.address), types.principal(eWallet1.address)],
                eCaller.address
            ),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "refer-reward-ft -- verify miscellaneous ft traits",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const eCaller = accounts.get("deployer")!;
        // verify name
        let name = chain.callReadOnlyFn('refer-reward-ft', 'get-name',
        [], eCaller.address);
        name.result.expectOk().expectAscii('Refer rewards');
        // verify symbol
        let symbol = chain.callReadOnlyFn('refer-reward-ft', 'get-symbol',
        [], eCaller.address);
        symbol.result.expectOk().expectAscii('RR');
        // verify decimals
        let decimals = chain.callReadOnlyFn('refer-reward-ft', 'get-decimals',
        [], eCaller.address);
        decimals.result.expectOk().expectUint(2);
        // verify uri
        let uri = chain.callReadOnlyFn('refer-reward-ft', 'get-token-uri',
        [], eCaller.address);
        uri.result.expectOk().expectSome().expectUtf8("https://www.tintash.com/");
        // verify balance
        let balance = chain.callReadOnlyFn('refer-reward-ft', 'get-balance-of',
        [types.principal(eCaller.address)], eCaller.address);
        balance.result.expectOk().expectUint(10);
        // verify balance
        let totalSupply = chain.callReadOnlyFn('refer-reward-ft', 'get-total-supply',
        [], eCaller.address);
        totalSupply.result.expectOk().expectUint(10);
    },
});

Clarinet.test({
    name: "user-mgmt -- users can refer new users",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let eReferrer = accounts.get('wallet_1')!;
        let eUser = accounts.get('wallet_2')!;
        let block = chain.mineBlock([
            Tx.contractCall ('refer-reward-ft', 'signup-by-referrer', 
                [types.principal(eUser.address)],
                eReferrer.address
            ),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "user-mgmt -- users cannot refer themselves",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let eUser = accounts.get('wallet_2')!;
        let block = chain.mineBlock([
            Tx.contractCall ('refer-reward-ft', 'signup-by-referrer', 
                [types.principal(eUser.address)],
                eUser.address
            ),
        ]);
        block.receipts[0].result.expectErr().expectUint(110);
    },
});

Clarinet.test({
    name: "user-mgmt -- reward is sent to referrer after new user makes transaction",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get('deployer')!;
        let eReferrer = accounts.get('wallet_1')!;
        let eUser = accounts.get('wallet_2')!;
        const tokensReward = 10;
        // get initial balance
        let balance = chain.callReadOnlyFn('refer-reward-ft', 'get-balance-of',
            [types.principal(eReferrer.address)], eReferrer.address);
        balance.result.expectOk().expectUint(0);
        
        let block = chain.mineBlock([
            Tx.contractCall ('refer-reward-ft', 'signup-by-referrer', 
                [types.principal(eUser.address)],
                eReferrer.address
            ),
            Tx.contractCall ('refer-reward-ft', 'complete-transaction', 
                [], eUser.address
            ),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectBool(true);

        // get balance
        balance = chain.callReadOnlyFn('refer-reward-ft', 'get-balance-of',
            [types.principal(eReferrer.address)], eReferrer.address);
        balance.result.expectOk().expectUint(tokensReward);
    },
});

Clarinet.test({
    name: "user-mgmt -- unregistered user cannot make transaction",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let eUser = accounts.get('wallet_2')!;
        
        let block = chain.mineBlock([
            Tx.contractCall ('refer-reward-ft', 'complete-transaction', 
                [], eUser.address
            ),
        ]);
        block.receipts[0].result.expectErr().expectUint(110);
    },
});