## Overview

This is the marketplace for trading `Velocity` NFTs. You can claim the first `100` `Velocity` for free and then each token can be claimed for `10000` micro STX. The total `Velocity` NFTs available are only `1000` that can be claimed.
Owners can sell their `Velocity` for a minimum price of `10000` micro STX.
Buyers can buy a `Velocity` for the specified price and a commission of `2.5%` will be cut from the total cost. That 2.5% will go to the contract owner and the remaining 97.5% will go to the seller.

## How to start

- Open terminal and change directory `cd` to this project's contract and execute `clarinet integrate`
- Login with the `Devnet.toml` deployer login credentials in `Hiro Wallet Extension`
- Make sure that `useMocknet` is set to `true` in order to use `Mocknet` in `App.js`
- Open terminal and change directory `cd` to this project's front-end and execute `npm start` to start the application.

## How to Trade

- First of all you will have to login with your Hiro Wallet to the website in order to start trading.
- You can claim tokens if they are available for either free or for some stx.
- You can buy tokens by clicking `Buy Tokens` and then entering the token-id you want to buy and press `Check` to see if it's available for sale or not
- You can sell tokens by clicking `Sell Tokens` and enter the token-id of the tokens you own.

_Note: The front end is limited for now. You can easily use read-only contract-calls to show the list of Velocitys users can buy. However, the front-end covers the basic trading for the NFTs_
