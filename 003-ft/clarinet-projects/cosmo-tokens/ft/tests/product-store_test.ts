import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v0.14.0/index.ts";

Clarinet.test({
  name: "Ensure that contract-owner can add product",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const storeContract = `${deployer.address}.product-store`;
    const amount = 10;

    let block = chain.mineBlock([
      Tx.contractCall(
        storeContract,
        "add-product",
        [types.ascii("Candy"), types.uint(amount), types.uint(50)],
        deployer.address
      ),
    ]);
    block.receipts[0].result.expectOk().expectUint(200);
  },
});

Clarinet.test({
  name: "Ensure that contract owner can delete product",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const storeContract = `${deployer.address}.product-store`;
    const amount = 10;

    let block = chain.mineBlock([
      Tx.contractCall(
        storeContract,
        "add-product",
        [types.ascii("Candy"), types.uint(amount), types.uint(50)],
        deployer.address
      ),
      Tx.contractCall(
        storeContract,
        "delete-product",
        [types.ascii("Candy")],
        deployer.address
      ),
    ]);
    block.receipts[0].result.expectOk().expectUint(200);
    block.receipts[1].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "Ensure that customer can get price of product",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const storeContract = `${deployer.address}.product-store`;
    const amount = 10;

    let block = chain.mineBlock([
      Tx.contractCall(
        storeContract,
        "add-product",
        [types.ascii("Candy"), types.uint(amount), types.uint(50)],
        deployer.address
      ),
      Tx.contractCall(
        storeContract,
        "get-product-price",
        [types.ascii("Candy")],
        deployer.address
      ),
    ]);
    block.receipts[0].result.expectOk().expectUint(200);
    block.receipts[1].result.expectOk().expectUint(amount);
  },
});

Clarinet.test({
  name: "Ensure that customer can buy product",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;
    const ft = `${deployer.address}.cosmo-ft`;
    const storeContract = `${deployer.address}.product-store`;
    const amount = 10;

    let block = chain.mineBlock([
      Tx.contractCall(
        ft,
        "add-valid-contract-caller",
        [types.principal(storeContract)],
        deployer.address
      ),
      Tx.contractCall(
        storeContract,
        "add-product",
        [types.ascii("Candy"), types.uint(amount), types.uint(50)],
        deployer.address
      ),
      Tx.contractCall(
        storeContract,
        "buy-product",
        [types.ascii("Candy")],
        wallet1.address
      ),
    ]);
    block.receipts[0].result.expectOk().expectBool(true);
    block.receipts[1].result.expectOk().expectUint(200);
    block.receipts[2].result.expectOk().expectBool(true);
    block.receipts[2].events.expectFungibleTokenMintEvent(
      amount * 1000,
      wallet1.address,
      `${deployer.address}.cosmo-ft::cosmo-ft`
    );
    block.receipts[2].events.expectSTXTransferEvent(
      amount,
      wallet1.address,
      storeContract
    );
  },
});

Clarinet.test({
  name: "Ensure that customer can transfer token to some other user",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;
    const storeContract = `${deployer.address}.product-store`;
    const amount = 10;
    const tokens = amount * 1000;

    let block = chain.mineBlock([
      Tx.contractCall(
        storeContract,
        "add-product",
        [types.ascii("Candy"), types.uint(amount), types.uint(50)],
        deployer.address
      ),
      Tx.contractCall(
        storeContract,
        "buy-product",
        [types.ascii("Candy")],
        deployer.address
      ),
      Tx.contractCall(
        storeContract,
        "transfer-reward-tokens",
        [types.uint(tokens), types.principal(wallet1.address)],
        deployer.address
      ),
    ]);
    block.receipts[0].result.expectOk().expectUint(200);
    block.receipts[1].result.expectOk().expectBool(true);
    block.receipts[2].result.expectOk().expectBool(true);
    block.receipts[2].events.expectFungibleTokenTransferEvent(
      tokens,
      deployer.address,
      wallet1.address,
      `${deployer.address}.cosmo-ft::cosmo-ft`
    );
  },
});

Clarinet.test({
  name: "Ensure that customer can redeem tokens",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const storeContract = `${deployer.address}.product-store`;
    const amount = 10;
    const tokens = amount * 1000;

    let block = chain.mineBlock([
      Tx.contractCall(
        storeContract,
        "add-product",
        [types.ascii("Candy"), types.uint(amount), types.uint(50)],
        deployer.address
      ),
      Tx.contractCall(
        storeContract,
        "buy-product",
        [types.ascii("Candy")],
        deployer.address
      ),
      Tx.contractCall(
        storeContract,
        "redeem-reward-tokens",
        [types.uint(tokens)],
        deployer.address
      ),
    ]);
    block.receipts[0].result.expectOk().expectUint(200);
    block.receipts[1].result.expectOk().expectBool(true);
    block.receipts[2].result.expectOk().expectUint(200);
    block.receipts[2].events.expectFungibleTokenBurnEvent(
      tokens,
      deployer.address,
      `${deployer.address}.cosmo-ft::cosmo-ft`
    );
    block.receipts[2].events.expectSTXTransferEvent(
      amount,
      storeContract,
      deployer.address
    );
  },
});

Clarinet.test({
  name: "Ensure that user can get bonus points count",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;
    const ft = `${deployer.address}.cosmo-ft`;
    const storeContract = `${deployer.address}.product-store`;
    const amount = 10;
    const tokens = amount * 1000;

    let block = chain.mineBlock([
      Tx.contractCall(
        ft,
        "add-valid-contract-caller",
        [types.principal(storeContract)],
        deployer.address
      ),
      Tx.contractCall(
        storeContract,
        "add-product",
        [types.ascii("Candy"), types.uint(amount), types.uint(50)],
        deployer.address
      ),
      Tx.contractCall(
        storeContract,
        "buy-product",
        [types.ascii("Candy")],
        wallet1.address
      ),
      Tx.contractCall(
        storeContract,
        "get-bonus-points-count",
        [],
        wallet1.address
      ),
    ]);
    block.receipts[0].result.expectOk().expectBool(true);
    block.receipts[1].result.expectOk().expectUint(200);
    block.receipts[2].result.expectOk().expectBool(true);
    block.receipts[2].events.expectFungibleTokenMintEvent(
      tokens,
      wallet1.address,
      `${deployer.address}.cosmo-ft::cosmo-ft`
    );
    block.receipts[2].events.expectSTXTransferEvent(
      amount,
      wallet1.address,
      storeContract
    );
    block.receipts[3].result.expectOk().expectUint(tokens);
  },
});

Clarinet.test({
  name: "Ensure that contract-owner can't add product with quantity set as 0",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const storeContract = `${deployer.address}.product-store`;
    const amount = 10;

    let block = chain.mineBlock([
      Tx.contractCall(
        storeContract,
        "add-product",
        [types.ascii("Candy"), types.uint(amount), types.uint(0)],
        deployer.address
      ),
    ]);
    block.receipts[0].result.expectErr().expectUint(406);
  },
});

Clarinet.test({
  name: "Ensure that contract-owner can't add product with price set as 0",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const storeContract = `${deployer.address}.product-store`;
    const amount = 0;

    let block = chain.mineBlock([
      Tx.contractCall(
        storeContract,
        "add-product",
        [types.ascii("Candy"), types.uint(amount), types.uint(5)],
        deployer.address
      ),
    ]);
    block.receipts[0].result.expectErr().expectUint(401);
  },
});

Clarinet.test({
  name: "Ensure that adding product twice updates the quantity",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const storeContract = `${deployer.address}.product-store`;
    const amount = 10;
    const quantity = 50;
    const productName = "Candy";

    let block = chain.mineBlock([
      Tx.contractCall(
        storeContract,
        "add-product",
        [types.ascii(productName), types.uint(amount), types.uint(quantity)],
        deployer.address
      ),
      Tx.contractCall(
        storeContract,
        "add-product",
        [types.ascii(productName), types.uint(amount), types.uint(quantity)],
        deployer.address
      ),
      Tx.contractCall(
        storeContract,
        "get-product-quantity",
        [types.ascii(productName)],
        deployer.address
      ),
    ]);
    block.receipts[0].result.expectOk().expectUint(200);
    block.receipts[1].result.expectOk().expectUint(200);
    block.receipts[2].result.expectUint(quantity * 2);
  },
});

Clarinet.test({
  name: "Ensure that user can't buy product when its quantity is 0",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;
    const ft = `${deployer.address}.cosmo-ft`;
    const storeContract = `${deployer.address}.product-store`;
    const amount = 10;
    const quantity = 50;
    const productName = "Candy";

    let block = chain.mineBlock([
      Tx.contractCall(
        ft,
        "add-valid-contract-caller",
        [types.principal(storeContract)],
        deployer.address
      ),
      Tx.contractCall(
        storeContract,
        "add-product",
        [types.ascii(productName), types.uint(amount), types.uint(quantity)],
        deployer.address
      ),
      Tx.contractCall(
        storeContract,
        "buy-product",
        [types.ascii("Candy")],
        wallet1.address
      ),
      Tx.contractCall(
        storeContract,
        "buy-product",
        [types.ascii("Candy")],
        wallet1.address
      ),
    ]);
    block.receipts[0].result.expectOk().expectBool(true);
    block.receipts[1].result.expectOk().expectUint(200);
    block.receipts[2].result.expectOk().expectBool(true);
    block.receipts[3].result.expectOk().expectBool(true);
  },
});
