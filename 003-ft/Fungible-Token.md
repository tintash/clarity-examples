# Token Contract

To declare a token type, the smart contract calls the
`define-fungible-token` function with a token name, and optionally the
maximum number of tokens you intend to issue to accounts:

    (define-fungible-token fishing-frenzy)

or

    (define-fungible-token fishing-frenzy u5000000)

The name `fishing-frenzy` can now be used in the smart contract to
transfer tokens, create new ones, etc.

It is also useful to keep track of the contract owner; the simplest
way to do it is to declare a constant:

    (define-constant TOKEN_OWNER 'SP3T6RJ8DKMJ4XB7DFTER1B9SX91GYBKXT3Y2YA74)

The contract must also implement the functions defined in the SIP-010 trait.

## Fungible Token Trait

To identify a smart contract as a token contract, your smart contract
must implement a trait that includes both functions for metadata
describing your token to the blockchain, and functions related to
handling tokens.  The metadata is also used to display information
about the token in wallets and in the
[explorer](https://explorer.stacks.co/).

For convenience, the FT trait is deployed on the mainnet at

    'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-10-ft-standard

However, it is not necessary to use this trait directly; you will
likely want to [copy
it](https://explorer.stacks.co/txid/SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-10-ft-standard?chain=mainnet)
to use for local development and testnet deployment.

**Note that the contract does not need to actually *implement* the trait using `impl-trait`, but it does need to contain all the required functions.**

### Trait Metadata Functions

`get-symbol`: This read-only function returns a short string of type
`(string-ascii 32)` describing the token.  For example

    (define-read-only (get-symbol)
      (ok "FF"))

`get-name`: This read-only function returns the name of the token as a
string (also of type `(string-ascii 32)`).  For example,

    (define-read-only (get-name)
      (ok "Fishing Frenzy Points"))

`get-decimal`: Most real-world currencies have two decimal places,
like $5.23, or Rs 47.35.  This read-only function lets you describe
how many digits of a user's balance are after the decimal point as an
unsigned integer.  If an account has 2305 tokens and `(get-decimal)`
returns u2, the explorer will display the user's holdings as 23.05.
For example,

    (define-read-only (get-decimal)
       (ok u0))                         ;; a currency like ¥

Note that tokens are always integer values (uint) inside the contract.

`get-token-uri`: This read-only function returns an optional string
with a URI to some metadata in JSON format describing the token.  The
metadata can include a longer textual description of the token, and a
link to an image for the token.

    (define-read-only (get-token-uri)
      (ok "https://www.tintash.com/"))

### Trait Token Functions

`get-balance-of`: This read-only function that returns the amount of
tokens an account has.  The contract itself does not have to track
this information; instead, it can use the `ft-get-balance` function
implemented in Stacks.  For example,

    (define-read-only (get-balance-of (account principal))
      (ok (ft-get-balance fishing-frenzy account)))

`get-total-supply`: Stacks keeps track of all the tokens that are held
by accounts, and can return the total amount with `ft-get-supply`.
For example,

    (define-read-only (get-total-supply)
      (ok (ft-get-supply fishing-frenzy)))

`transfer`: This public function can be used to transfer tokens from
one account to another.  It can be as simple as a wrapper around
`ft-transfer?`:

    (define-public (transfer (amount uint) (sender principal)
                             (recipient principal) (memo (optional (buff 34))))
      (begin
        ;; we don't want random people transfering away someone else's tokens
        (asserts! (or (is-eq tx-sender sender)
                      (is-eq tx-sender TOKEN_OWNER))
                  (err u100))
        (try! (ft-transfer? fishing-frenzy amount sender recipient))
        (print memo)
        (ok true)))

The optional memo field can be used by the recipient to identify the
sender, without knowing their principal ahead of time.

## Other Token Operations

There must be a way to start things off -- how do accounts get tokens
in the first place?  The process of giving tokens to an account is
called *minting*; Stacks has a function called `ft-mint?` for this
purpose:

    (define-public (give (amount uint) (address principal))
      (begin
        ;; we don't want random people giving themselves tokens
        (asserts! (is-eq tx-sender TOKEN_OWNER) (err u100))
        (ft-mint? fishing-frenzy amount address)))

This adds `amount` tokens to the total supply of the contract.  If a
limit was set when the fungible token was declared (with the second
argument to `define-fungible-token`), an error will be raised if we
attempt to mint more than the limit.

How do you remove tokens from the total supply?  This is called *burning*:

    (define-public (destroy (amount uint) (address principal))
      (begin
        ;; we don't want random people destroying someone else's tokens
        (asserts! (or (is-eq tx-sender address)
                      (is-eq tx-sender TOKEN_OWNER))
                  (err u100))
        (ft-burn? fishing-frenzy amount address)))

This lowers the total supply of tokens as tracked by the blockchain
and reported by `ft-get-supply`.

*end*
