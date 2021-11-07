# Split App/Data Contracts

There is no way to "upgrade" or modify the smart contract after it has
been deployed to the blockchain.  If you notice a bug in your smart
contract, or want to add functionality, you will need to deploy
another contract and update all external references to point to the
new one.

There are a couple of ways to approach this problem.  One way is to
create a "proxy" or "relay" contract that is the public interface to
your smart contract.  All the proxy contract does is forward function
calls to the real contract.  When you upgrade your actual contract,
you tell the proxy contract to use the new one.  Callers of your
contract continue to call the proxy contract, unaware that the actual
functionality has changed.

This works best if your contract stores a small amount of data, and
you can easily copy the data to the new contract.  That's generally
not the case, though.  If you have deep structures (lots of maps,
large lists, etc.), it can be either very costly or impossible to copy
the data to a new contract.

The other solution to this problem is to split the smart contract into
two contracts: a "data" contract that holds just the data fields and
the functions to manipulate them, and an "app" contract that contains
code.  The app contract is the external interface, and is called by
users (standard principals) or other contracts.  The data contract is
only called by the app contracts.  (I use the term "app contracts"
here instead of "app contract" because you can have multiple app
contracts that point to the same data contract.)

One way to do this is:

* write a trait that lists the public callable functions implemented
  in the data contract
* write the data contract, and implement the trait
* write an app contract that uses the trait to communicate with the data contract
* (later) write an updated app contract that uses the same trait to
  communicate with the same data contract

Deploy the trait first, then the data contract, and finally the app
contract.  Note that the trait does not have to be a separate
deployment; you can put the trait at the beginning of the data
contract's file.

You will have to write the data contract in such a way that it

* has functionality related to adding/updating/etc the data fields inside it
* has some way to check if the function caller is a valid app contract
  (you don't want random users or unknown contracts calling it)

## Deliverables

* sequence diagram for mermaidjs, as text (save it in a text file
  called `diagrams/appdata.mmd`)
* data contract with a trait (can be an internal or external trait)
* an app contract that calls it
* a second app contract that also calls the data contract
* tests that show that the data contract allows only valid callers
* tests that demonstrate upgrading from the first app contract to the second
* a `README.md` describing your solution

The data contract does not have to be very complicated -- it could
simply wrap a single map or data var.

## Some things to consider

* the data contract and app contracts can have different deployers
* how do you tell the app contract which data contract to use?
* how do you tell the data contract which app contracts can call it?
* after upgrading to a second app contract, do you disallow calls from
  the first one?  why or why not?

## Extra functionality (bonus points)

* add the ability to pause a contract
* combine the proxy contract solution with the split data-app solution
  to provide a seamless interface for upgrades
