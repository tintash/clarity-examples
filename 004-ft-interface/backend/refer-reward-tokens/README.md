### Overview

This application implements nodejs backend for Refer-Rewards contract on testnet. Application uses stacksjs lib to make calls to contract.

Public function calls to contract are authenticated using private key of user.

For a frontend app, Hiro wallet supports user auth with @stacks/connect and offers a user-session object which contains user keys. But for a standalone node app, this is not possible. Documentation offers an authentication methed [here.](https://blog.blockstack.org/blockstack-authentication-server-side-node-js/) I was able to get JWT token for user from nodejs app, but the next steps were to pass this token to authenticator app which requires window object and is not available in nodejs.
So for now this app requires a manual mnemonic input, which can be done by making a POST request.

### Run

1. clone & open in vs
2. `npm install`
3. install extension for REST requests
   - `code --install-extension humao.rest-client`
4. `npm start`
5. open [request.rest](requests.rest) file and click the "Send Request" button against a request

### Read-Only contract calls

1. http://localhost:3000/contractAPI/tokenName
2. http://localhost:3000/contractAPI/tokenURI
3. http://localhost:3000/contractAPI/tokenSupply
4. http://localhost:3000/contractAPI/tokenDecimals
5. http://localhost:3000/contractAPI/tokenSymbol

### Public contract calls

1. http://localhost:3000/referUser?useremail=...
2. http://localhost:3000/completeTransaction

Public calls return a valid transaction id on success. Which you can verify on sandbox.

### Update query params

ReferUser - call need two parameters, new user email and stacks address. You can edit both of these by changing `useremail` and `useraddress` in http://localhost:3000/referUser?useremail=... request in [request.rest](requests.rest) file.

### Updating mnemonic

Application has a default mnemonic, which is used to generate private and this key is used for transaction signing. You can add your mnemonic here for e.g. before calling `completeTransaction` request
http://localhost:3000/contractAPI/setMnemonic?mnemonic="inside claim ...."
