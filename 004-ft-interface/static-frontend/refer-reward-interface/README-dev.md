## Stacks wallet connect

_[This is by no means a guide. Just the steps I followed while learning react, typescript, stacks eco and clarity. Will extend / fork & create an FT app around it, using Clarity smart contract]_

simple app using @stacks/connect-react & @stacks/ui to connect stacks wallet.

App borrows a lot from [Heystack](https://docs.stacks.co/build-apps/examples/heystack#heystack-overview) on [Stacks](https://stacks.org)

1. create and verify template

```
npx create-react-app stacks-auth --template typescript
yarn start
```

2. cleanup template _[first commit in this repo]_
3. add sample auth code from [link](https://docs.stacks.co/build-apps/guides/authentication#usage-in-react-apps)
4. add dependencies, specially
   - @stacks/ui
   - @stacks/connect-react
5. Note above code won't work straight away, wrap it in a function first
6. At this point app should connect with wallet account

#### User session & state management

1. add required hooks and componenets from [Heystack]()
2. Install state management lib - Jotai
3. add logout button in user-area

#### Contract info calls

1. Add contract constants in [constants.ts](src/common/constants.ts)
2. Add an info panel component in [contract-info-panel.tsx](src/components/contract-info-panel.tsx)
3. Add dependendcies
   1. @stacks/transactions
   2. jotai
4. Add contract readonly functions in [refer-reward.ts](/src/store/refer-reward.ts)

#### Issues 
1. loading spinner on refer and transaction buttons
2. Responsiveness 