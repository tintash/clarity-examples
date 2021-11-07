
// @ts-ignore
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
// @ts-ignore
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

// Clarinet.test({
//     // maybe i need to change contract so anyone can sell ?? 
//     name: "contract is deployed by seller",
//     async fn(chain: Chain, accounts: Map<string, Account>) {
//         let eSeller = accounts.get('wallet_1')!;
//         const orderId = 0;
//         const amount = 100;
//         let block = chain.mineBlock([
//             Tx.contractCall ("escrow", "seller-deposit", 
//                 [types.uint(orderId), types.uint(amount)],
//                 eSeller.address
//             ),
//         ]);
//         block.receipts[0].result.expectErr().expectUint(100);
//     },
// });

Clarinet.test({
    name: "seller can deposit to contract",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let eSeller = accounts.get('deployer')!;
        const orderId = 0;
        const amount = 100;
        let block = chain.mineBlock([
            Tx.contractCall ('escrow', 'seller-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eSeller.address
            ),
        ]);
        block.receipts[0].events.expectSTXTransferEvent(
            amount, eSeller.address, `${eSeller.address}.escrow`);
    },
});

Clarinet.test({
    name: "seller can deposit only once for order",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let eSeller = accounts.get('deployer')!;
        const orderId = 0;
        const amount = 100;
        let block = chain.mineBlock([
            Tx.contractCall ('escrow', 'seller-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eSeller.address
            ),

            Tx.contractCall ('escrow', 'seller-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eSeller.address
            ),
        ]);
        
        block.receipts[1].result.expectErr().expectUint(120);
    },
});

Clarinet.test({
    name: "seller can deposit to more than one orders",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let eSeller = accounts.get('deployer')!;
        const orderId_1 = 0;
        const orderId_2 = 1;
        const amount = 100;
        let block = chain.mineBlock([
            Tx.contractCall ('escrow', 'seller-deposit', 
                [types.uint(orderId_1), types.uint(amount)],
                eSeller.address
            ),

            Tx.contractCall ('escrow', 'seller-deposit', 
                [types.uint(orderId_2), types.uint(amount)],
                eSeller.address
            ),
        ]);
        // can verify events here too 
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "deposit / price cannot be zero",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let eSeller = accounts.get('deployer')!;
        const orderId = 0;
        const amount = 0;
        let block = chain.mineBlock([
            Tx.contractCall ('escrow', 'seller-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eSeller.address
            ),
        ]);
        block.receipts[0].result.expectErr().expectUint(110)
    },
});

Clarinet.test({
    name: "seller must deposit before buyer",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let eBuyer = accounts.get('wallet_1')!;
        const orderId = 0;
        const amount = 100;
        let block = chain.mineBlock([
            Tx.contractCall ("escrow", "buyer-deposit", 
                [types.uint(orderId), types.uint(amount)],
                eBuyer.address
            ),
        ]);
        block.receipts[0].result.expectErr().expectUint(120);
    },
});

Clarinet.test({
    name: "buyer can deposit to contract",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let eSeller = accounts.get('deployer')!;
        let eBuyer = accounts.get('wallet_1')!;
        const orderId = 0;
        const amount = 100;
        let block = chain.mineBlock([
            Tx.contractCall ('escrow', 'seller-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eSeller.address
            ),
            Tx.contractCall ("escrow", "buyer-deposit", 
                [types.uint(orderId), types.uint(amount)],
                eBuyer.address
            ),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].events.expectSTXTransferEvent(
            amount, eBuyer.address, `${eSeller.address}.escrow`);
    },
});

Clarinet.test({
    name: "buyer must deposit same amount as seller",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let eSeller = accounts.get('deployer')!;
        let eBuyer = accounts.get('wallet_1')!;
        const orderId = 0;
        const sellerAmount = 100;
        const buyerAmount = 50;
        let block = chain.mineBlock([
            Tx.contractCall ('escrow', 'seller-deposit', 
                [types.uint(orderId), types.uint(sellerAmount)],
                eSeller.address
            ),
            Tx.contractCall ("escrow", "buyer-deposit", 
                [types.uint(orderId), types.uint(buyerAmount)],
                eBuyer.address
            ),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectErr().expectUint(110);
    },
});

Clarinet.test({
    name: "only buyer can complete transaction",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let eSeller = accounts.get('deployer')!;
        let eBuyer = accounts.get('wallet_1')!;
        let eUnknown = accounts.get('wallet_2')!;
        const orderId = 0;
        const amount = 100;
        let block = chain.mineBlock([
            Tx.contractCall ('escrow', 'seller-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eSeller.address
            ),
            Tx.contractCall ('escrow', 'buyer-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eBuyer.address
            ),
            Tx.contractCall ('escrow', 'item-received', 
                [types.uint(orderId)],
                eUnknown.address
            ),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectBool(true);
        block.receipts[2].result.expectErr().expectUint(100);
    },
});

Clarinet.test({
    name: "on transaction complete, funds are distributed",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let eSeller = accounts.get('deployer')!;
        let eBuyer = accounts.get('wallet_1')!;
        const orderId = 0;
        const amount = 100;
        const price = amount / 2;
        
        let block = chain.mineBlock([
            Tx.contractCall ('escrow', 'seller-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eSeller.address
            ),
            Tx.contractCall ('escrow', 'buyer-deposit', 
                [types.uint(orderId), types.uint(amount)],
                eBuyer.address
            ),
            Tx.contractCall ('escrow', 'item-received', 
                [types.uint(orderId)],
                eBuyer.address
            ),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectBool(true);
        block.receipts[2].result.expectOk().expectBool(true);
        block.receipts[2].events.expectSTXTransferEvent(
            (amount + price), `${eSeller.address}.escrow`,
            eSeller.address
        );
        block.receipts[2].events.expectSTXTransferEvent(
            (amount - price), `${eSeller.address}.escrow`,
            eBuyer.address
        );
    },
});