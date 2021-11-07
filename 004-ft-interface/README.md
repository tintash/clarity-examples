# Interacting with Smart Contracts

## Backend

Write a web server (preferably in Typescript) to interact with your
smart contract in task #3 on the testnet.

The web server can serve a simple web page where you can click on
buttons to make read-only calls to the contract and get information,
or call public functions in your contract (by creating transactions).

The
[@stacks/transactions](https://www.npmjs.com/package/@stacks/transactions)
library will help you on the backend.  [This
page](https://docs.stacks.co/write-smart-contracts/values) will also
help here.

## Static Frontend

Write a static web page that uses the stacks transaction library (and
others if necessary -- see https://blockstack.github.io/stacks.js/ or
https://github.com/blockstack/stacks.js for a list) to interact with
your smart contract.  This will not need a backend server of any kind
to do the work; it'll do everything on its own.  (Although, you might
need a server to host the web page and associated stylesheets or other
resources.)

The page will integrate with the [Hiro
Wallet](https://www.hiro.so/wallet/install-web) browser extension to
make transactions with the [@stacks/connect
library](https://github.com/blockstack/connect).
