# Using the Stacks Wallet

A wallet is a piece of software that keeps track of your blockchain
keys and addresses, and also lets you interact with the blockchain by
making transactions.  There are official Stacks wallets for the
desktop and browsers [here](https://www.hiro.so/wallet).  In this
document, we will walk you through setting up a Stacks Wallet and
making a couple of test transactions on the Stacks testnet.

## !!!WARNING!!!

During the creation of a new wallet, you will be asked to note down a
12 or 24 word seed phrase.

* **DO NOT LOSE THE SEED PHRASE.**
* **DO NOT GIVE YOUR SEED PHRASE TO ANYONE.**

The seed phrase is used to derive a private/public key pair, and your
Stacks address.  If you install the wallet on another computer, phone,
or browser, you will need to enter the same seed phrase to access your
Stacks account.

**If you lose your seed phrase, and your Stacks account has STX or other
tokens associated with it, you won't be able to access those tokens.**

## Installation: Browser

The easiest way to get started is to install the browser extension for
the Stacks wallet.  On [this
page](https://www.hiro.so/wallet/install-web), select the browser you
use, and install the wallet.

## Initial Setup

If you have never set up a wallet before, create a new software
wallet.  **WRITE DOWN THE SEED PHRASE YOU ARE GIVEN.**  You will be
asked to verify the seed phrase, and then asked to set up a password.

If you ever lose your password, it's not the end of the world.  You
can always recreate your wallet with your seed phrase by reinstalling
the browser extension.

## Switch To the Testnet

In the wallet, click on menu (three dots), select *Change Network*,
and pick the testnet.

Visit the [Stacks
explorer](https://explorer.stacks.co/?chain=testnet), and take a look
at your account's details (copy your address from the wallet and paste
it into the explorer's form).  (Click on the *Connect Stacks Wallet*
button if it appears.)

## Get STX

Stacks provides a faucet that will send 500 STX to your account on the
testnet.  Visit the [faucet's
page](https://explorer.stacks.co/sandbox/faucet?chain=testnet) on the
explorer, and click on the button to request STX.  Clicking on the
button will create a transaction that you will see on your address's
page in the explorer.

It can take up to ten minutes for the transaction to be mined.

## Try: Transfer STX

Click on
[transfer](https://explorer.stacks.co/sandbox/transfer?chain=testnet)
and send 1 STX to *ST3T6RJ8DKMJ4XB7DFTER1B9SX91GYBKXT27QC6FM*, with
your initials in the memo field.  The wallet should pop up a window
and ask you to confirm the transaction.

## Try: Call Contract Function

Try calling [this
contract](https://explorer.stacks.co/txid/0xa8a9b8e9595312dd6334b71269e61fb13a5dc3d5be1a56aec3c9d80aa2fcdcee?chain=testnet).  To make the function calls, copy the contract's principal and go to [this page](https://explorer.stacks.co/sandbox/contract-call?chain=testnet).  Paste in the contract's principal, and call the functions from the next page.

Try calling the *send* function first, with 100 STX, and then call the
*return* function.

## Try: Deploy Contract

After testing your contracts locally, you can deploy them to the
testnet
[here](https://explorer.stacks.co/sandbox/deploy?chain=testnet).
Change the contract's name, paste your code into the text box, and
submit.
