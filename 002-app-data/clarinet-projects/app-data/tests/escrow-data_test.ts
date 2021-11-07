
// @ts-ignore
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
// @ts-ignore
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

/*
    ADDED TESTS FOR ALL CONTRACTS IN ONE FILE SO EXECUTION ORDER
    AND CONSOLE OUTPUT IS SAME FOR EACH RUN. WITH MULTUPLE FILES 
    TESTS WERE RUNNING IN SEEMINGLY RANDOM ORDER. 
    TODO: find a better way of handling this!
*/

Clarinet.test({
    name: "standard principal cannot call restricted data contract functions",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let eSeller = accounts.get('deployer')!;
        let eBuyer = accounts.get('wallet_1')!;
        let eUnknown = accounts.get('wallet_2')!;
        const orderId = 0;
        const amount = 100;
        let block = chain.mineBlock([
            Tx.contractCall ('escrow-data', 'seller-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eSeller.address
            ),
            Tx.contractCall ('escrow-data', 'buyer-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eBuyer.address
            ),
            Tx.contractCall ('escrow-data', 'item-received', 
                [types.uint(orderId), types.principal(eSeller.address)],
                eSeller.address
            ),
        ]);
        block.receipts[0].result.expectErr().expectUint(99);
        block.receipts[1].result.expectErr().expectUint(99);
        block.receipts[2].result.expectErr().expectUint(99);
    },
});

Clarinet.test({
    name: "only contract owner can authorize/de-authorize contract calling principals",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get('deployer')!;
        let eContractPrincipal = accounts.get('wallet_1')!;
        let eUnknown = accounts.get('wallet_1')!;
        let block = chain.mineBlock([
            // deployer adds contract principal to valid list 
            Tx.contractCall ('escrow-data', 'add-caller', 
                [types.principal(`${eContractPrincipal.address}.escrow-app`)],
                deployer.address
            ),
            // deployer removes contract principal from valid list 
            Tx.contractCall ('escrow-data', 'remove-caller', 
                [types.principal(`${eContractPrincipal.address}.escrow-app`)],
                deployer.address
            ),
            // eUnknown tries to add contract principal to valid list
            Tx.contractCall ('escrow-data', 'add-caller', 
                [types.principal(`${deployer.address}.escrow-app`)],
                eUnknown.address
            ),
            // eUnknown tries to add contract principal to valid list
            Tx.contractCall ('escrow-data', 'remove-caller', 
                [types.principal(`${deployer.address}.escrow-app`)],
                eUnknown.address
            ),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectBool(true);
        block.receipts[2].result.expectErr().expectUint(100);
        block.receipts[3].result.expectErr().expectUint(100);
    },
});

// ********************** data contract ends ********************** 

// ********************** app contract starts ********************** 

Clarinet.test({
    name: "sellers & buyers can deposit using app contract",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get('deployer')!;
        let eSeller = accounts.get('wallet_1')!;
        let eBuyer = accounts.get('wallet_2')!;
        const orderId = 0;
        const amount = 100;
        let block = chain.mineBlock([
            // add app contract to authorized callers list
            Tx.contractCall ('escrow-data', 'add-caller',
                [types.principal(`${deployer.address}.escrow-app`)],
                deployer.address
            ),
            // sellers deposits using app contract
            // types.principal(`${deployer.address}.escrow-data`), 
            Tx.contractCall ('escrow-app', 'seller-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eSeller.address
            ),
            // buyer deposits using app contract 
            Tx.contractCall ('escrow-app', 'buyer-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eBuyer.address
            ),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectBool(true);
        block.receipts[2].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    // this should not happen in app-v2 
    name: "FOR DEMONSTRATION ONLY - seller CAN complete purchase using app contract",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get('deployer')!;
        let eSeller = accounts.get('wallet_1')!;
        let eBuyer = accounts.get('wallet_2')!;
        const orderId = 0;
        const amount = 100;
        let block = chain.mineBlock([
            // add app contract to authorized callers list
            Tx.contractCall ('escrow-data', 'add-caller',
                [types.principal(`${deployer.address}.escrow-app`)],
                deployer.address
            ),
            // sellers deposits using app contract
            Tx.contractCall ('escrow-app', 'seller-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eSeller.address
            ),
            // buyer deposits using app contract 
            Tx.contractCall ('escrow-app', 'buyer-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eBuyer.address
            ),
            // seller completes purchase without sending item
            Tx.contractCall ('escrow-app', 'item-received', 
                [types.principal(`${deployer.address}.escrow-data`), types.uint(orderId), types.principal(eSeller.address)],
                eSeller.address
            ),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectBool(true);
        block.receipts[2].result.expectOk().expectBool(true);
        // transfer events can alse be read here, but this should be enough
        block.receipts[3].result.expectOk().expectBool(true);

    },
});

// ********************** app contract ends ********************** 

// ********************** app-v2 contract starts ********************** 

Clarinet.test({
    name: "sellers & buyers can deposit using app-v2 contract",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get('deployer')!;
        let eSeller = accounts.get('wallet_1')!;
        let eBuyer = accounts.get('wallet_2')!;
        const orderId = 0;
        const amount = 100;
        let block = chain.mineBlock([
            // add app-v2 contract to authorized callers list
            Tx.contractCall ('escrow-data', 'add-caller',
                [types.principal(`${deployer.address}.escrow-app-v2`)],
                deployer.address
            ),
            // sellers deposits using app contract
            Tx.contractCall ('escrow-app-v2', 'seller-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eSeller.address
            ),
            // buyer deposits using app contract 
            Tx.contractCall ('escrow-app-v2', 'buyer-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eBuyer.address
            ),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectBool(true);
        block.receipts[2].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "app contract cannot be called after app-v2 is deployed",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get('deployer')!;
        let eSeller = accounts.get('wallet_1')!;
        let eBuyer = accounts.get('wallet_2')!;
        const orderId = 0;
        const amount = 100;
        let block = chain.mineBlock([
            // add app contract to authorized callers list
            Tx.contractCall ('escrow-data', 'add-caller',
                [types.principal(`${deployer.address}.escrow-app`)],
                deployer.address
            ),
            // add app-v2 contract to authorized callers list
            Tx.contractCall ('escrow-data', 'add-caller',
                [types.principal(`${deployer.address}.escrow-app-v2`)],
                deployer.address
            ),
            // remove app contract from authorized callers list
            Tx.contractCall ('escrow-data', 'remove-caller',
                [types.principal(`${deployer.address}.escrow-app`)],
                deployer.address
            ),
            // sellers deposits using app contract - should fail
            Tx.contractCall ('escrow-app', 'seller-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eSeller.address
            ),
            // buyer deposits using app contract - should fail 
            Tx.contractCall ('escrow-app', 'buyer-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eBuyer.address
            ),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectBool(true);
        block.receipts[2].result.expectOk().expectBool(true);
        block.receipts[3].result.expectErr().expectUint(99);
        block.receipts[4].result.expectErr().expectUint(99);
    },
});

Clarinet.test({
    // this should not happen in app-v2 
    name: "FOR DEMONSTRATION ONLY - seller CANNOT complete purchase using app-v2 contract",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get('deployer')!;
        let eSeller = accounts.get('wallet_1')!;
        let eBuyer = accounts.get('wallet_2')!;
        const orderId = 0;
        const amount = 100;
        let block = chain.mineBlock([
            // add app contract to authorized callers list
            Tx.contractCall ('escrow-data', 'add-caller',
                [types.principal(`${deployer.address}.escrow-app-v2`)],
                deployer.address
            ),
            // sellers deposits using app contract
            Tx.contractCall ('escrow-app-v2', 'seller-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eSeller.address
            ),
            // buyer deposits using app contract 
            Tx.contractCall ('escrow-app-v2', 'buyer-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eBuyer.address
            ),
            // seller completes purchase without sending item -- should fail
            Tx.contractCall ('escrow-app-v2', 'item-received', 
                [types.principal(`${deployer.address}.escrow-data`), types.uint(orderId), types.principal(eSeller.address)],
                eSeller.address
            ),
            // seller completes purchase without sending item -- should fail
            Tx.contractCall ('escrow-app-v2', 'item-received', 
                [types.principal(`${deployer.address}.escrow-data`), types.uint(orderId), types.principal(eBuyer.address)],
                eSeller.address
            ),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectBool(true);
        block.receipts[2].result.expectOk().expectBool(true);
        block.receipts[3].result.expectErr().expectUint(100);
        block.receipts[4].result.expectErr().expectUint(100);
    },
});

// ********************** app-v2 contract ends ********************** 