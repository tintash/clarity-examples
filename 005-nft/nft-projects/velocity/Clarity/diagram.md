sequenceDiagram
participant Market
participant NFT
participant Seller
participant Buyer
Seller ->> NFT : Claim Token
NFT -->> Seller: Mint 1 NFT
Seller ->> Market : Put NFT for sale
Buyer ->> Market : Buy NFT for sale with commission
Seller -->> Market : Transfers NFT ownership
Market -->> Buyer : Transfers NFT ownership
