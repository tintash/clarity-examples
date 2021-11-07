## Fungible tokens example

This example implements SIP10 fungible token trait to create referral rewards system. These reward tokens are transferred to referrers after new users signup and perform certain number of transactions.

Example contains a contract and a SIP-10 FT trait.

### Files

- **contracts/ft-traits.clar**
  - defines traits for fungible tokens
- **contracts/refer-reward-ft.clar**
  - implements ft-traits for refer-reward tokens
  - offers functions like refer, signup, complete-transactions
- **tests/\*.ts**
  - contains test cases

### Testnet deployment

| Contract        | Address                                                        |
| :-------------- | :------------------------------------------------------------- |
| ft-trait        | `ST2V7C1FR46HSV42S5XCZNJ80XE513E9526DGSC6E.ft-trait`           |
| refer-reward-ft | `ST2V7C1FR46HSV42S5XCZNJ80XE513E9526DGSC6E.refer-reward-ft-v4` |

### Flow

Existing users invite new users to system by registering user's address and email. Contract will save referrer's address and app (_using this contract_) will send an invite email to new user. New users can also self register without mentioning referrer. After registration, users can perform transactions. Reward is only offered to referrer, if new user makes certain number of transactions. Details of transactions are out of scope of this example. Currently transaction number is set to 1, for simplicity. Contract automatically sends reward tokens to referrer and removes it from user's stored info.

**_User registration by referrer_**
![Sequence Diagram](diagrams/signup-by-referrer.png)

**_Self registration without referrer_**
![Sequence Diagram](diagrams/signup-self.png)

**_Transactions and rewards flow_**
![Sequence Diagram](diagrams/transactions-reward.png)

### Design key points

- One User can invite multiple new users and will be rewarded for each one
- A user cannot refer her/himself
- Once a referrer is rewarded for a new user, its principal is removed from new user's info map
- Transactions are not reverted if refer-reward fails for any reason
