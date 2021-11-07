# Fungible Tokens

Tokens (sometimes called *assets* or *coins*) represent some kind of
value tracked by a smart contract.  A token can be anything, like a
virtual currency, a redeemable gift certificate, or a license to run
some software.  The two kinds of tokens are *fungible tokens* (FT),
where each token is indistinguishable from any other, and
*non-fungible tokens* (NFT), where each token represents a unique
item.

A real-world example of a fungible token is currency: there is no
difference in the *value* of two currency bills of the same
denomination.  The $10 bill in my wallet has the same value as the $10
bill in your wallet, even though they will have different serial
numbers.

A real-world example of a non-fungible token is a drivers license: my
license is unique to me, just as your license is unique to you, even
though they might be issued by the same state.

In this exercise, you'll create a fungible token contract, and deploy
it to the testnet.

## Documentation & Links

Stacks provides built-in support for for tracking tokens similar to
how it tracks STX balances for principals, and has Clarity functions
for manipulating them.  There are two standards for tokens:

* FT: [SIP-010](https://github.com/stacksgov/sips/blob/hstove-feat/sip-10-ft/sips/sip-010/sip-010-fungible-token-standard.md) *work in progress*
* NFT: [SIP-009](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md)

The [fungible token](Fungible-Token.md) document in this repository
describes what you need to implement to write a SIP-010 contract.

There is a
[repository](https://github.com/hstove/stacks-fungible-token) with an
example contract that you might find useful to read.

If you have not set up a Stacks wallet before, this
[document](Stacks-Wallet.md) will help you do that.

## Task

Think of something you want to track with your contract.  For example,
you could give tokens to people for performing tasks (you do not have
to worry right now about how the smart contract knows that they have
completed the task).  You could use tokens to track player scores in
games.  You could reward people for writing reviews on Camaradly.

[This](https://www.sciencedirect.com/science/article/pii/S0167739X21000480)
paper might offer some ideas.

Create diagrams and write up your proposed design *before* writing any
code.

## Deliverables

* sequence diagram for mermaidjs, as text (save it in a text file
  called `diagrams/gametoken.mmd`)
* a `README.md` describing your solution
* fungible token contract -- all the functions in the trait implemented
* tests that exercise all functions in the contract (the code in the repository will help here)
* deploy the smart contract to the testnet

## Extra functionality (bonus points)

* add the ability to pause a contract (something went wrong, how do you handle it?)
