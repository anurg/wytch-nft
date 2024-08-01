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

```
solana-keygen new --outfile owner.json
solana config set --keypair owner.json
solana config set --url https://api.devnet.solana.com
solana connfig get

sugar launch

//optional
sugar upload
sugar deploy
sugar verify
```
