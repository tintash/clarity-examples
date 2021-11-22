### Clash of Clans like game using SFTs

`coc.clar` contract uses `SIP-013` standard for defining multiple in-game currencies and commodities using a single SFT.

SFT trait and its implementation are copied from [here](https://github.com/MarvinJanssen/stx-semi-fungible-token).

`burn` function is added in `semi-fungible-token`. This was needed for balance management of different sub tokens or token ids.

Game has `gold, elixir & dark-elixir` currencies. Players can either buy these or earn with game-play. Players own `townhall, defenses, buildings, troops and heroes / warriors`. All of which can be upgraded using in-game currencies. Upgrade costs are defined as maps for each commodity. More complex upgrade rules can be added later.

#### Copyrights

I used to play [Clash of Clans](https://supercell.com/en/games/clashofclans/) a lot. Its balanced economy and gameplay are really good. Code in this contract is loosely based on same concept. But this is just for learning and no copyright violation is intended.
