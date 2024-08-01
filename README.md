# Solana Minting dApp Scaffold Next

This was developed with the help of Solana dapp scaffold project

|        Responsive        |          Desktop          |
| :----------------------: | :-----------------------: |
| ![](scaffold-mobile.png) | ![](scaffold-desktop.png) |

### Steps to install this

install node version 16.16.0 using the command

```
npm i -g node@16.16.0
```

Then install the dependencies in project folder using command

```
npm install --legacy-peer-deps
```

Then run the project using

```
npm run dev
```

### how to setup the candy machine

Sugar : https://github.com/metaplex-foundation/sugar/releases (Install Sugar to your PC)
Github Link: https://github.com/appslk/SolanaNFTCreation/blob/main/SolanaNFTCreation (Instruction Summary)
Solana Faucet: https://solfaucet.com/ (After you create the wallet using CLI, take devnet currency for testing)

Pls follow the video with the instructions, I will send you a testing dapp soon for test minting

Create a folder for project e.g. sugar
inside sugar folder create assets folder
put all nft & json files inside assets folder

```
solana-keygen new --outfile owner.json
solana config set --keypair owner.json
solana config set --url https://api.devnet.solana.com
solana config get

sugar launch

//optional
sugar upload
sugar deploy
sugar verify
```

Generate the merkle-root from here: https://tools.key-strokes.com/merkle-root

This is the config file according to your new request. You can replace the existing config file with this and edit inside and put your things there and after that run the command "sugar guard add" after that check whether the respective guards have been added correctly by this command "sugar guard show"
