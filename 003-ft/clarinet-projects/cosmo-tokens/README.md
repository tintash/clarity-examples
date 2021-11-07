# Cosmo FT

## _ft-trait.clar_

It defines the standard trait defined in [SIP-010](https://github.com/hstove/sips/blob/feat/sip-10-ft/sips/sip-010/sip-010-fungible-token-standard.md) followed by a series of function signatures which must be implemented by the contract implementing fungible tokens.
The contract is deployed on testnet at `'ST3F9BYX07T0Q51JT2YVXT532BNZGY78KT7ZMH6KC.ft-trait `

## _cosmo-ft.clar_

It implements the trait defined in ft-trait.clar. It provides implementation of the functions defined in the trait to implement the **COSMO TOKEN**
The contract is deployed on testnet at `'ST3F9BYX07T0Q51JT2YVXT532BNZGY78KT7ZMH6KC.cosmo-ft `

## _product-store.clar_

The product-store contract provides basic CRUDs for the products. It allows users to buy products from the store and grants **COSMO TOKENS** on each purchase as gift points. The users can transfer these gift points to their friends or redeem them to get some STXs in return.
The contract is deployed on testnet at `'ST3F9BYX07T0Q51JT2YVXT532BNZGY78KT7ZMH6KC.product-store `

## Key points

- Use impl-trait function to ensure a contract is properly implementing the trait
- Only points owner and token owner can destroy tokens
- Only valid contract and token owner can mint new tokens
