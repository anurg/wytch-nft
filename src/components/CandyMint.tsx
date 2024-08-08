import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, TransactionSignature } from "@solana/web3.js";
import { FC, useCallback, useMemo, useState, useEffect } from "react";
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from "../stores/useUserSOLBalanceStore";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  transactionBuilder,
  publicKey,
  some,
} from "@metaplex-foundation/umi";
import {
  TokenPaymentMintArgs,
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
  route,
  safeFetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  fetchMetadata,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import * as bs58 from "bs58";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import {
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-candy-machine";
import axios from "axios";
import { FindNftByMintInput, Metaplex } from "@metaplex-foundation/js";
import { url } from "inspector";
import { Footer2 } from "./Footer2";
import { Console } from "console";

const allowList = ["AJ4n3QhbP7hXBZYChfUHvPU1Lvg3rEVRFdaLn27sqQ28"];

//You can create various allow lists as you like

const allowList2 = ["Yfct9FDL4VtoS3QyBStsuG9BpGwkpUnpwT8pHEizZih"];

const allowList3 = ["5Me6gyoojSiBFf5r8DNNogyYpkvs3mq8ieXycAVyQRkE"];

const quicknodeEndpoint =
  process.env.NEXT_PUBLIC_RPC; /* || clusterApiUrl('devnet')*/
const candyMachineAddress = publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID);
const treasury = publicKey(process.env.NEXT_PUBLIC_TREASURY);

interface ItemData {
  name?: string;
  uri?: string;
}

export const CandyMint: FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { getUserSOLBalance } = useUserSOLBalanceStore();
  const [_itemsRedeemed, setItemsRedeemed] = useState(0);
  const [_itemsLoaded, setTotalSupply] = useState(0);
  const [showMintOptions, setShowMintOptions] = useState(false);
  const [mintedImg, setMintedImg] = useState<string>("");
  const [imageID, setImageID] = useState<string>("");
  const [itemDatas, setItemDatas] = useState<ItemData[]>([]);
  const [_showWL1, setShowWL1] = useState(false);
  const [_showWL2, setShowWL2] = useState(false);
  const [_showWL3, setShowWL3] = useState(false);
  const [_pageNo, setPageNo] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [_lastPage, setLastPage] = useState(10);
  const [_o, setO] = useState(0);
  const [_loader, set_loader] = useState(0);
  const [_loaded, setLoaded] = useState(0);
  const [_type1, set_type1] = useState(0);
  const [_type2, set_type2] = useState(0);
  const [_type3, set_type3] = useState(0);
  const [_type4, set_type4] = useState(0);
  const [_type5, set_type5] = useState(0);
  const [_type6, set_type6] = useState(0);
  const [selectedType, setSelectedType] = useState(null);

  const [_value0_1, set_value0_1] = useState("");
  const [_value1_1, set_value1_1] = useState("");
  const [_value2_1, set_value2_1] = useState("");
  const [_value3_1, set_value3_1] = useState("");
  const [_value4_1, set_value4_1] = useState("");
  const [_value5_1, set_value5_1] = useState("");

  const [_value0_2, set_value0_2] = useState("");
  const [_value1_2, set_value1_2] = useState("");
  const [_value2_2, set_value2_2] = useState("");
  const [_value3_2, set_value3_2] = useState("");
  const [_value4_2, set_value4_2] = useState("");
  const [_value5_2, set_value5_2] = useState("");
  const [_value6_2, set_value6_2] = useState("");
  const [_value7_2, set_value7_2] = useState("");
  const [_value8_2, set_value8_2] = useState("");

  const [_value0_3, set_value0_3] = useState("");
  const [_value1_3, set_value1_3] = useState("");
  const [_value2_3, set_value2_3] = useState("");
  const [_value3_3, set_value3_3] = useState("");
  const [_value4_3, set_value4_3] = useState("");
  const [_value5_3, set_value5_3] = useState("");
  const [_value6_3, set_value6_3] = useState("");
  const [_value7_3, set_value7_3] = useState("");
  const [_value8_3, set_value8_3] = useState("");
  const [_value9_3, set_value9_3] = useState("");
  const [_value10_3, set_value10_3] = useState("");
  const [_value11_3, set_value11_3] = useState("");
  const [_value12_3, set_value12_3] = useState("");
  const [_value13_3, set_value13_3] = useState("");
  const [_value14_3, set_value14_3] = useState("");
  const [_value15_3, set_value15_3] = useState("");

  const [_value0_4, set_value0_4] = useState("");
  const [_value1_4, set_value1_4] = useState("");
  const [_value2_4, set_value2_4] = useState("");
  const [_value3_4, set_value3_4] = useState("");
  const [_value4_4, set_value4_4] = useState("");

  const [_value0_5, set_value0_5] = useState("");
  const [_value1_5, set_value1_5] = useState("");
  const [_value2_5, set_value2_5] = useState("");
  const [_value3_5, set_value3_5] = useState("");
  const [_value4_5, set_value4_5] = useState("");
  const [_value5_5, set_value5_5] = useState("");

  const [_value0_6, set_value0_6] = useState("");
  const [_value1_6, set_value1_6] = useState("");
  const [_value2_6, set_value2_6] = useState("");
  const [_value3_6, set_value3_6] = useState("");
  const [_value4_6, set_value4_6] = useState("");
  const [_value5_6, set_value5_6] = useState("");

  const handleClick = (type) => {
    setSelectedType(type);
  };

  const handleReset = () => {
    setSelectedType(null);
  };

  const handleMintClick = () => {
    setShowMintOptions(true);
  };

  const umi = useMemo(
    () =>
      createUmi(quicknodeEndpoint)
        .use(walletAdapterIdentity(wallet))
        .use(mplCandyMachine())
        .use(mplTokenMetadata()),
    [
      wallet,
      mplCandyMachine,
      walletAdapterIdentity,
      mplTokenMetadata,
      quicknodeEndpoint,
      createUmi,
    ]
  );

  /*
    
    
    const publicMint = useCallback(async () => {
        if (!wallet.publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }


        // Fetch the Candy Machine.
        const candyMachine = await fetchCandyMachine(
            umi,
            candyMachineAddress,
        );
        // Fetch the Candy Guard.
        const candyGuard = await safeFetchCandyGuard(
            umi,
            candyMachine.mintAuthority,
        );



        // Fetch the Candy Guard.
        const itemsRedeemed = candyMachine.itemsRedeemed;
        console.log("itemsRedeemed :" + itemsRedeemed);
        setItemsRedeemed(Number(itemsRedeemed));

        try {
            // Mint from the Candy Machine.
            const nftMint = generateSigner(umi);

            const nft = mintV2(umi, {
                candyMachine: candyMachine.publicKey,
                candyGuard: candyGuard?.publicKey,
                nftMint,
                collectionMint: candyMachine.collectionMint,
                collectionUpdateAuthority: candyMachine.authority,
                group: some('public'), // you have to mention the relevant group here

                mintArgs: {
                    solPayment: some({ destination: treasury }), //treasury is the destination address
                },
            });
            const transaction = await transactionBuilder()
                .add(setComputeUnitLimit(umi, { units: 800_000 }))
                .add(nft
                );
            const { signature } = await transaction.sendAndConfirm(umi, {
                confirm: { commitment: "confirmed" },
            });
            const txid = bs58.encode(signature);
            console.log('success', `Mint successful! ${txid}`)
            notify({ type: 'success', message: 'Mint successful!', txid });


            console.log("nft Details" + JSON.stringify(nft));

            const mintAddress = nftMint.publicKey;

            const mintAddressPublicKey = new PublicKey(mintAddress);

            // Create an object with the mintAddress property
            const findNftInput: FindNftByMintInput = {
                mintAddress: mintAddressPublicKey,
            };

            // Create a Metaplex instance
            const metaplex = new Metaplex(connection);

            // Fetch the NFT metadata
            const nftMetadata = await metaplex.nfts().findByMint(findNftInput);

            console.log("nftMetadata : " + JSON.stringify(nftMetadata));

            const imageUrl = nftMetadata.json.image;
            setMintedImg(imageUrl);

            const imageID = nftMetadata.json.name;
            setImageID(imageID);

            console.log("Image URL:", imageUrl);

            getUserSOLBalance(wallet.publicKey, connection);


        } catch (error: any) {
            notify({ type: 'error', message: `Error minting!`, description: error?.message });
            console.log('error', `Mint failed! ${error?.message}`);
        }
    }, [wallet, connection, getUserSOLBalance, umi, candyMachineAddress, treasury]);

    */

  //.................................. Mint .......................................//

  const publicMint = useCallback(async () => {
    if (!wallet.publicKey) {
      console.log("error", "Wallet not connected!");
      notify({
        type: "error",
        message: "error",
        description: "Wallet not connected!",
      });
      return;
    }

    // Fetch the Candy Machine.
    const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
    // Fetch the Candy Guard.
    const candyGuard = await safeFetchCandyGuard(
      umi,
      candyMachine.mintAuthority
    );

    // Fetch the Candy Guard.
    const itemsRedeemed = candyMachine.itemsRedeemed;
    console.log("itemsRedeemed :" + itemsRedeemed);
    setItemsRedeemed(Number(itemsRedeemed));

    try {
      // Mint from the Candy Machine.
      const nftMint = generateSigner(umi);

      const nft = mintV2(umi, {
        candyMachine: candyMachine.publicKey,
        candyGuard: candyGuard?.publicKey,
        nftMint,
        collectionMint: candyMachine.collectionMint,
        collectionUpdateAuthority: candyMachine.authority,
        group: some("public"), // you have to mention the relevant group here

        mintArgs: {
          solPayment: some({ destination: treasury }), //treasury is the destination address
        },
      });
      const transaction = await transactionBuilder().add(
        setComputeUnitLimit(umi, { units: 800_000 }).add(nft)
      );

      const { signature } = await transaction.sendAndConfirm(umi, {
        confirm: { commitment: "confirmed" },
      });
      const txid = bs58.encode(signature);
      console.log("success", `Mint successful! ${txid}`);
      notify({ type: "success", message: "Mint successful!", txid });

      console.log("nft Details" + JSON.stringify(nft));

      const mintAddress = nftMint.publicKey;

      const mintAddressPublicKey = new PublicKey(mintAddress);

      // Create an object with the mintAddress property
      const findNftInput: FindNftByMintInput = {
        mintAddress: mintAddressPublicKey,
      };

      // Create a Metaplex instance
      const metaplex = new Metaplex(connection);

      // Fetch the NFT metadata
      const nftMetadata = await metaplex.nfts().findByMint(findNftInput);

      console.log("nftMetadata : " + JSON.stringify(nftMetadata));

      const imageUrl = nftMetadata.json.image;
      setMintedImg(imageUrl);

      const imageID = nftMetadata.json.name;
      setImageID(imageID);

      console.log("Image URL:", imageUrl);

      getUserSOLBalance(wallet.publicKey, connection);
    } catch (error: any) {
      notify({
        type: "error",
        message: `Error minting!`,
        description: error?.message,
      });
      console.log("error", `Mint failed! ${error?.message}`);
    }
  }, [
    wallet,
    connection,
    getUserSOLBalance,
    umi,
    candyMachineAddress,
    treasury,
  ]);

  const WLMint = useCallback(async () => {
    if (!wallet.publicKey) {
      console.log("error", "Wallet not connected!");
      notify({
        type: "error",
        message: "error",
        description: "Wallet not connected!",
      });
      return;
    }

    try {
      // Fetch the Candy Machine.
      const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
      if (!candyMachine) {
        console.error("Candy Machine not found!");
        notify({ type: "error", message: "Candy Machine not found!" });
        return;
      }

      // Fetch the Candy Guard.
      const candyGuard = await safeFetchCandyGuard(
        umi,
        candyMachine.mintAuthority
      );
      if (!candyGuard) {
        console.error("Candy Guard is not initialized!");
        notify({ type: "error", message: "Candy Guard is not initialized!" });
        return;
      }

      // Pre-validate the wallet
      const root = getMerkleRoot(allowList);
      const proof = getMerkleProof(allowList, publicKey(umi.identity));

      console.log("root : " + root);
      console.log("proof : " + proof);
      console.log("umi : " + publicKey(umi.identity));

      await route(umi, {
        candyMachine: candyMachine.publicKey,
        candyGuard: candyGuard.publicKey,
        group: some("wl"), // you have to mention the relevant group here
        guard: "allowList",
        routeArgs: {
          path: "proof",
          merkleRoot: root,
          merkleProof: proof,
        },
      }).sendAndConfirm(umi);

      const rootHex = Buffer.from(root).toString("hex");
      console.log("Root (hex): " + rootHex);

      const itemsRedeemed = candyMachine.itemsRedeemed;
      console.log("Items Redeemed: " + itemsRedeemed);
      setItemsRedeemed(Number(itemsRedeemed));

      // Mint from the Candy Machine.

      const nftMint = generateSigner(umi);
      const transaction = await transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 800_000 }))
        .add(
          await mintV2(umi, {
            candyMachine: candyMachine.publicKey,
            candyGuard: candyGuard.publicKey,
            nftMint,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: candyMachine.authority,
            group: some("wl"), // you have to mention the relevant group here

            mintArgs: {
              allowList: some({ merkleRoot: root }),
              mintLimit: some({ id: 1 }),
            },
          })
        );

      const { signature } = await transaction.sendAndConfirm(umi, {
        confirm: { commitment: "confirmed" },
      });
      const txid = bs58.encode(signature);
      console.log("success", `Mint successful! ${txid}`);
      notify({ type: "success", message: "Mint successful!", txid });

      const mintAddress = nftMint.publicKey;

      const mintAddressPublicKey = new PublicKey(mintAddress);

      // Create an object with the mintAddress property
      const findNftInput: FindNftByMintInput = {
        mintAddress: mintAddressPublicKey,
      };

      // Create a Metaplex instance
      const metaplex = new Metaplex(connection);

      // Fetch the NFT metadata
      const nftMetadata = await metaplex.nfts().findByMint(findNftInput);

      console.log("nftMetadata : " + JSON.stringify(nftMetadata));

      const imageUrl = nftMetadata.json.image;
      setMintedImg(imageUrl);

      const imageID = nftMetadata.json.name;
      setImageID(imageID);

      console.log("Image URL:", imageUrl);

      getUserSOLBalance(wallet.publicKey, connection);
    } catch (error: any) {
      console.log("error", "An error occurred:", error);
      notify({
        type: "error",
        message: "An error occurred!",
        description: error.message,
      });
    }
  }, [wallet, umi, candyMachineAddress, allowList, setItemsRedeemed]);

  const WLMint2 = useCallback(async () => {
    if (!wallet.publicKey) {
      console.log("error", "Wallet not connected!");
      notify({
        type: "error",
        message: "error",
        description: "Wallet not connected!",
      });
      return;
    }

    try {
      // Fetch the Candy Machine.
      const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
      if (!candyMachine) {
        console.error("Candy Machine not found!");
        notify({ type: "error", message: "Candy Machine not found!" });
        return;
      }

      // Fetch the Candy Guard.
      const candyGuard = await safeFetchCandyGuard(
        umi,
        candyMachine.mintAuthority
      );
      if (!candyGuard) {
        console.error("Candy Guard is not initialized!");
        notify({ type: "error", message: "Candy Guard is not initialized!" });
        return;
      }

      // Pre-validate the wallet
      const root = getMerkleRoot(allowList2);
      const proof = getMerkleProof(allowList2, publicKey(umi.identity));

      console.log("root : " + root);
      console.log("proof : " + proof);
      console.log("umi : " + publicKey(umi.identity));

      await route(umi, {
        candyMachine: candyMachine.publicKey,
        candyGuard: candyGuard.publicKey,
        group: some("wl2"), // you have to mention the relevant group here
        guard: "allowList",
        routeArgs: {
          path: "proof",
          merkleRoot: root,
          merkleProof: proof,
        },
      }).sendAndConfirm(umi);

      const rootHex = Buffer.from(root).toString("hex");
      console.log("Root (hex): " + rootHex);

      const itemsRedeemed = candyMachine.itemsRedeemed;
      console.log("Items Redeemed: " + itemsRedeemed);
      setItemsRedeemed(Number(itemsRedeemed));

      // Mint from the Candy Machine.

      const nftMint = generateSigner(umi);
      const transaction = await transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 800_000 }))
        .add(
          await mintV2(umi, {
            candyMachine: candyMachine.publicKey,
            candyGuard: candyGuard.publicKey,
            nftMint,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: candyMachine.authority,
            group: some("wl2"), // you have to mention the relevant group here

            mintArgs: {
              allowList: some({ merkleRoot: root }),
              mintLimit: some({ id: 2 }),
            },
          })
        );

      const { signature } = await transaction.sendAndConfirm(umi, {
        confirm: { commitment: "confirmed" },
      });
      const txid = bs58.encode(signature);
      console.log("success", `Mint successful! ${txid}`);
      notify({ type: "success", message: "Mint successful!", txid });

      const mintAddress = nftMint.publicKey;

      const mintAddressPublicKey = new PublicKey(mintAddress);

      // Create an object with the mintAddress property
      const findNftInput: FindNftByMintInput = {
        mintAddress: mintAddressPublicKey,
      };

      // Create a Metaplex instance
      const metaplex = new Metaplex(connection);

      // Fetch the NFT metadata
      const nftMetadata = await metaplex.nfts().findByMint(findNftInput);

      console.log("nftMetadata : " + JSON.stringify(nftMetadata));

      const imageUrl = nftMetadata.json.image;
      setMintedImg(imageUrl);

      const imageID = nftMetadata.json.name;
      setImageID(imageID);

      console.log("Image URL:", imageUrl);

      getUserSOLBalance(wallet.publicKey, connection);
    } catch (error: any) {
      console.log("error", "An error occurred:", error);
      notify({
        type: "error",
        message: "An error occurred!",
        description: error.message,
      });
    }
  }, [wallet, umi, candyMachineAddress, allowList2, setItemsRedeemed]);

  const WLMint3 = useCallback(async () => {
    if (!wallet.publicKey) {
      console.log("error", "Wallet not connected!");
      notify({
        type: "error",
        message: "error",
        description: "Wallet not connected!",
      });
      return;
    }

    try {
      // Fetch the Candy Machine.
      const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
      if (!candyMachine) {
        console.error("Candy Machine not found!");
        notify({ type: "error", message: "Candy Machine not found!" });
        return;
      }

      // Fetch the Candy Guard.
      const candyGuard = await safeFetchCandyGuard(
        umi,
        candyMachine.mintAuthority
      );
      if (!candyGuard) {
        console.error("Candy Guard is not initialized!");
        notify({ type: "error", message: "Candy Guard is not initialized!" });
        return;
      }

      // Pre-validate the wallet
      const root = getMerkleRoot(allowList3);
      const proof = getMerkleProof(allowList3, publicKey(umi.identity));

      console.log("root : " + root);
      console.log("proof : " + proof);
      console.log("umi : " + publicKey(umi.identity));

      await route(umi, {
        candyMachine: candyMachine.publicKey,
        candyGuard: candyGuard.publicKey,
        group: some("wl3"), // you have to mention the relevant group here
        guard: "allowList",
        routeArgs: {
          path: "proof",
          merkleRoot: root,
          merkleProof: proof,
        },
      }).sendAndConfirm(umi);

      const rootHex = Buffer.from(root).toString("hex");
      console.log("Root (hex): " + rootHex);

      const itemsRedeemed = candyMachine.itemsRedeemed;
      console.log("Items Redeemed: " + itemsRedeemed);
      setItemsRedeemed(Number(itemsRedeemed));

      // Mint from the Candy Machine.

      const nftMint = generateSigner(umi);
      const transaction = await transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 800_000 }))
        .add(
          await mintV2(umi, {
            candyMachine: candyMachine.publicKey,
            candyGuard: candyGuard.publicKey,
            nftMint,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: candyMachine.authority,
            group: some("wl3"), // you have to mention the relevant group here

            mintArgs: {
              allowList: some({ merkleRoot: root }),
              mintLimit: some({ id: 3 }),
            },
          })
        );

      const { signature } = await transaction.sendAndConfirm(umi, {
        confirm: { commitment: "confirmed" },
      });
      const txid = bs58.encode(signature);
      console.log("success", `Mint successful! ${txid}`);
      notify({ type: "success", message: "Mint successful!", txid });

      const mintAddress = nftMint.publicKey;

      const mintAddressPublicKey = new PublicKey(mintAddress);

      // Create an object with the mintAddress property
      const findNftInput: FindNftByMintInput = {
        mintAddress: mintAddressPublicKey,
      };

      // Create a Metaplex instance
      const metaplex = new Metaplex(connection);

      // Fetch the NFT metadata
      const nftMetadata = await metaplex.nfts().findByMint(findNftInput);

      console.log("nftMetadata : " + JSON.stringify(nftMetadata));

      const imageUrl = nftMetadata.json.image;
      setMintedImg(imageUrl);

      const imageID = nftMetadata.json.name;
      setImageID(imageID);

      console.log("Image URL:", imageUrl);

      getUserSOLBalance(wallet.publicKey, connection);
    } catch (error: any) {
      console.log("error", "An error occurred:", error);
      notify({
        type: "error",
        message: "An error occurred!",
        description: error.message,
      });
    }
  }, [wallet, umi, candyMachineAddress, allowList3, setItemsRedeemed]);

  //....................................................................................//

  async function candyTime() {
    // Fetch the Candy Machine.
    const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);

    // Fetch the Candy Guard.

    const itemsAvailable = candyMachine.itemsLoaded;
    setTotalSupply(Number(itemsAvailable));

    const itemsRedeemed = candyMachine.itemsRedeemed;
    console.log("itemsRedeemed :" + itemsRedeemed);
    setItemsRedeemed(Number(itemsRedeemed));

    const mintAuthority = candyMachine.mintAuthority;
    console.log("mintAuthority :" + mintAuthority);
    // setMintAuthority(mintAuthority);

    const authority = candyMachine.authority;
    console.log("authority :" + authority);
    // setMintAuthority(mintAuthority);

    /*for (let x = 0; x < 10; x++) {
             console.log("candyMachine.items :" + JSON.stringify(candyMachine.items[x]));
         }*/

    // Fetch the Candy Guard.
    const candyGuard = await safeFetchCandyGuard(
      umi,
      candyMachine.mintAuthority
    );

    console.log("SOL Payment :" + candyGuard.guards.solPayment.__option);
  }

  async function collection(pageNo) {
    set_loader(1);

    const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);

    setActivePage(pageNo);

    // Fetch the Candy Guard.

    const itemsAvailable = candyMachine.itemsLoaded;
    setTotalSupply(Number(itemsAvailable));

    const itemsRedeemed = candyMachine.itemsRedeemed;
    console.log("itemsRedeemed :" + itemsRedeemed);
    setItemsRedeemed(Number(itemsRedeemed));

    const mintAuthority = candyMachine.mintAuthority;
    console.log("mintAuthority :" + mintAuthority);
    // setMintAuthority(mintAuthority);

    const authority = candyMachine.authority;
    console.log("authority :" + authority);
    // setMintAuthority(mintAuthority);

    if (wallet.publicKey && connection) {
      const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
      let itemDataArray: ItemData[] = [];

      let hitFilter = false; // We are working on the filtering part

      let y = 25;

      console.log("pageNo : " + pageNo);
      let o = (pageNo - 1) * y;

      let loaded = 0;

      if (hitFilter) {
        for (let x = o; x < candyMachine.items.length && x < pageNo * y; x++) {
          var imageURL = await allImgs(candyMachine.items[x].uri);
          //console.log("INSIDE :" + imageURL);

          const response = await fetch(candyMachine.items[x].uri);
          const data = await response.json();
          //console.log("data.attributes.length : " + data.attributes.length);
          console.log("URI : " + response);

          console.log("value_to Check : " + data.attributes[0].value);

          if (
            data.attributes[0].value == _value0_1 ||
            data.attributes[0].value == _value1_1 ||
            data.attributes[0].value == _value2_1 ||
            data.attributes[0].value == _value3_1 ||
            data.attributes[0].value == _value4_1 ||
            data.attributes[0].value == _value5_1 ||
            data.attributes[1].value == _value0_2 ||
            data.attributes[1].value == _value1_2 ||
            data.attributes[1].value == _value2_2 ||
            data.attributes[1].value == _value3_2 ||
            data.attributes[1].value == _value4_2 ||
            data.attributes[1].value == _value5_2 ||
            data.attributes[1].value == _value6_2 ||
            data.attributes[1].value == _value7_2 ||
            data.attributes[1].value == _value8_2 ||
            data.attributes[1].value == _value0_3 ||
            data.attributes[1].value == _value1_3 ||
            data.attributes[1].value == _value2_3 ||
            data.attributes[1].value == _value3_3 ||
            data.attributes[1].value == _value4_3 ||
            data.attributes[1].value == _value5_3 ||
            data.attributes[1].value == _value0_4 ||
            data.attributes[1].value == _value1_4 ||
            data.attributes[1].value == _value2_4 ||
            data.attributes[1].value == _value3_4 ||
            data.attributes[1].value == _value4_4 ||
            data.attributes[1].value == _value0_5 ||
            data.attributes[1].value == _value1_5 ||
            data.attributes[1].value == _value2_5 ||
            data.attributes[1].value == _value3_5 ||
            data.attributes[1].value == _value4_5 ||
            data.attributes[1].value == _value5_5 ||
            data.attributes[1].value == _value0_6 ||
            data.attributes[1].value == _value1_6 ||
            data.attributes[1].value == _value2_6 ||
            data.attributes[1].value == _value3_6 ||
            data.attributes[1].value == _value4_6 ||
            data.attributes[1].value == _value5_6

            /* && candyMachine.items[x].minted*/
          ) {
            console.log(
              "candyMachine.items[x].minted" + candyMachine.items[x].minted
            );
            itemDataArray.push({
              name: candyMachine.items[x].name,
              uri: imageURL,
            });

            console.log("Y" + y);
          } else {
            y++;
            console.log("Y2" + y);
          }

          loaded++;
          var percentage = (loaded * 100) / y;
          console.log("percentage : " + percentage);
          setLoaded(percentage);

          console.log("_value0_1 : " + _value0_1);
          console.log("_value0_1 : " + _value1_1);
          console.log("_value0_2 : " + _value2_1);
          console.log("_value0_3 : " + _value3_1);
          console.log("_value0_4 : " + _value4_1);
          console.log("_value0_5 : " + _value5_1);
        }
      } else {
        for (let x = o; x < candyMachine.items.length && x < pageNo * 25; x++) {
          loaded++;
          var percentage = loaded * 4;
          console.log("percentage : " + percentage);
          setLoaded(percentage);

          var imageURL = await allImgs(candyMachine.items[x].uri);
          //console.log("INSIDE :" + imageURL);

          const response = await fetch(candyMachine.items[x].uri);
          const data = await response.json();
          //console.log("data.attributes.length : " + data.attributes.length);
          console.log("URI : " + response);
          var notUrl = "https://witch-8vg.pages.dev/imgs/witch.jpg";
          console.log("value_to Check : " + data.attributes[0].value);

          itemDataArray.push({
            name: candyMachine.items[x].name,
            uri: candyMachine.items[x].minted ? imageURL : notUrl,
          });
        }
      }
      setItemDatas(itemDataArray);

      set_loader(0);
      setLoaded(0);
    }

    //  console.log(`Collection function called with page number: ${pageNo}`);
  }

  async function allImgs(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      //  console.log("ALL : " + data.image);

      return data.image;
    } catch (error) {
      console.error("Error:", error);
      throw error; // re-throw the error so that the caller can handle it if needed
    }
  }

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);

      for (let x = 0; x < allowList.length; x++) {
        if (allowList[x] == wallet.publicKey.toBase58()) {
          setShowWL1(true);
          console.log("WL:1 Eligible");
        }
      }

      for (let x = 0; x < allowList2.length; x++) {
        if (allowList2[x] == wallet.publicKey.toBase58()) {
          setShowWL2(true);
          console.log("WL:2 Eligible");
        }
      }

      for (let x = 0; x < allowList3.length; x++) {
        if (allowList3[x] == wallet.publicKey.toBase58()) {
          setShowWL3(true);
          console.log("WL:3 Eligible");
        }
      }

      candyTime();
    }

    collection(_pageNo);

    console.log("UE_WL1 : " + _showWL1);
    console.log("UE_WL2 : " + _showWL2);
    console.log("UE_WL3 : " + _showWL3);
  }, [
    wallet.publicKey,
    connection,
    getUserSOLBalance,
    _showWL1,
    _showWL2,
    _showWL3,
    _pageNo,
  ]);

  const pageIndexer = () => {
    let pageIndexes = [];

    for (let x = _o; x < 10 + Number(_o); x++) {
      const pageNum = x + 1;
      pageIndexes.push(
        <div
          key={x}
          onClick={() => collection(pageNum)}
          className={
            pageNum === activePage ? "EachNumber active" : "EachNumber"
          }
        >
          {pageNum}
        </div>
      );
    }
    return pageIndexes;
  };

  const arrowClicked = () => {
    console.log("Number(_o) + 25" + (Number(_o) + 10));
    var count = Number(_o) + 10;
    if (count < 191) {
      setO(Number(_o) + 10);
    }
  };

  const arrowLast = () => {
    console.log("ArrowLast" + 191);

    setO(191);
  };

  const arrowFirst = () => {
    console.log("ArrowLast" + 0);

    setO(0);
  };

  const arrowPrevious = () => {
    console.log("ArrowPrevious" + 0);

    console.log("Number(_o) + 25" + (Number(_o) + 10));
    var count = Number(_o) - 10;
    if (count > 10) {
      setO(Number(_o) - 10);
    }
  };

  /*const type1 = () => {
        set_type1(1);
        set_type2(0);
        set_type3(0);
        set_type4(0);
        set_type5(0);
        set_type6(0);
    }

    const type2 = () => {
        set_type1(0);
        set_type2(1);
        set_type3(0);
        set_type4(0);
        set_type5(0);
        set_type6(0);
    }

    const type3 = () => {
        set_type1(0);
        set_type2(0);
        set_type3(1);
        set_type4(0);
        set_type5(0);
        set_type6(0);
    }

    const type4 = () => {
        set_type1(0);
        set_type2(0);
        set_type3(0);
        set_type4(1);
        set_type5(0);
        set_type6(0);
    }

    const type5 = () => {
        set_type1(1);
        set_type2(0);
        set_type3(0);
        set_type4(0);
        set_type5(1);
        set_type6(0);
    }

    const type6 = () => {
        set_type1(1);
        set_type2(0);
        set_type3(0);
        set_type4(0);
        set_type5(0);
        set_type6(1);
    }*/

  //FACE

  const face0 = () => {
    set_value0_1("Faces1");
  };

  const face1 = () => {
    set_value1_1("Faces2");
  };

  const face2 = () => {
    set_value2_1("Faces3");
  };

  const face3 = () => {
    set_value3_1("Faces4");
  };

  const face4 = () => {
    set_value4_1("Faces5");
  };

  const face5 = () => {
    set_value5_1("Faces6");
  };

  //EARS

  const ear0 = () => {
    set_value0_2("ears1");
  };

  const ear1 = () => {
    set_value1_2("ears2");
  };

  const ear2 = () => {
    set_value2_2("ears3");
  };

  const ear3 = () => {
    set_value3_2("ears4");
  };

  const ear4 = () => {
    set_value4_2("ears5");
  };

  const ear5 = () => {
    set_value5_2("ears6");
  };

  const ear6 = () => {
    set_value6_2("ears7");
  };

  const ear7 = () => {
    set_value7_2("ears8");
  };

  const ear8 = () => {
    set_value8_2("ears9");
  };

  //NOSE

  const nose0 = () => {
    set_value0_3("nose1");
  };

  const nose1 = () => {
    set_value1_3("nose2");
  };

  const nose2 = () => {
    set_value2_3("nose3");
  };

  const nose3 = () => {
    set_value3_3("nose4");
  };

  const nose4 = () => {
    set_value4_3("nose5");
  };

  const nose5 = () => {
    set_value5_3("nose6");
  };

  const nose6 = () => {
    set_value6_3("nose7");
  };

  const nose7 = () => {
    set_value7_3("ears8");
  };

  const nose8 = () => {
    set_value8_3("ears9");
  };

  const nose9 = () => {
    set_value9_3("ears10");
  };

  const nose10 = () => {
    set_value10_3("ears11");
  };

  const nose11 = () => {
    set_value11_3("ears12");
  };

  const nose12 = () => {
    set_value12_3("ears13");
  };

  const nose13 = () => {
    set_value13_3("ears14");
  };

  const nose14 = () => {
    set_value14_3("ears15");
  };

  const nose15 = () => {
    set_value15_3("ears16");
  };

  //WHISKERS

  const whisker0 = () => {
    set_value0_4("whisker1");
  };

  const whisker1 = () => {
    set_value1_4("whisker2");
  };

  const whisker2 = () => {
    set_value2_4("whisker3");
  };

  const whisker3 = () => {
    set_value3_4("whisker4");
  };

  const whisker4 = () => {
    set_value4_4("whisker5");
  };

  //OUTLINE

  const outline0 = () => {
    set_value0_5("outline1");
  };

  const outline1 = () => {
    set_value1_5("outline2");
  };

  const outline2 = () => {
    set_value2_5("outline3");
  };

  const outline3 = () => {
    set_value3_5("outline4");
  };

  const outline4 = () => {
    set_value4_5("outline5");
  };

  //EYES

  const eye0 = () => {
    set_value0_6("eye1");
  };

  const eye1 = () => {
    set_value1_6("eye2");
  };

  return (
    <div className="mintDetails">
      <div>
        <div id="price">Minted {_itemsRedeemed}/5100</div>
        <div id="price">
          <span className="price2">Price: 0.01 SOL</span>
        </div>

        <p></p>

        <div className="btns3">
          <button className="gradient-button" onClick={publicMint}>
            Public Mint
          </button>

          {_showWL1 ? (
            <button className="gradient-button" onClick={WLMint}>
              Special Mint 1
            </button>
          ) : null}

          {_showWL2 ? (
            <button className="gradient-button" onClick={WLMint2}>
              Special Mint 2
            </button>
          ) : null}

          {_showWL3 ? (
            <button className="gradient-button" onClick={WLMint3}>
              Special Mint 3
            </button>
          ) : null}
        </div>

        {mintedImg ? (
          <div className="mintSection">
            <div className="idAmount">{imageID}</div>
            <img src={mintedImg} className="mintedNFT" alt="NFT Image" />
          </div>
        ) : null}

        <Footer2 />

        <div className="imgs2Main">
          <img
            className="witch1"
            src="https://imgswitch.pages.dev/imgs/1.png"
          />
          <img
            className="witch2"
            src="https://imgswitch.pages.dev/imgs/2.png"
          />
        </div>

        <div className="typesMain">
          {selectedType === null ? (
            <>
              <button onClick={() => handleClick("type1")}>Type 1</button>
              <button onClick={() => handleClick("type2")}>Type 2</button>
              <button onClick={() => handleClick("type3")}>Type 3</button>
              <button onClick={() => handleClick("type4")}>Type 4</button>
              <button onClick={() => handleClick("type5")}>Type 5</button>
              <button onClick={() => handleClick("type6")}>Type 6</button>
            </>
          ) : (
            <>
              {selectedType === "type1" && (
                <div className="typesMain2">
                  <button onClick={() => handleClick("type1")}>Type 1</button>
                  <div className="valuesDiv">
                    <div onClick={face0}>Face1</div>
                    <div onClick={face1}>Face2</div>
                    <div onClick={face2}>Face3</div>
                    <div onClick={face3}>Face4</div>
                    <div onClick={face4}>Face5</div>
                    <div onClick={face5}>Face6</div>
                  </div>
                  <div className="apply" onClick={() => collection(_pageNo)}>
                    Apply
                  </div>
                </div>
              )}
              {selectedType === "type2" && (
                <div className="typesMain2">
                  <button onClick={() => handleClick("type2")}>Type 2</button>
                  <div className="valuesDiv">
                    <div>test 1</div>
                    <div>test 1</div>
                    <div>test 1</div>
                    <div>test 1</div>
                    <div>test 1</div>
                  </div>
                </div>
              )}
              {selectedType === "type3" && (
                <div className="typesMain2">
                  <button onClick={() => handleClick("type3")}>Type 3</button>
                  <div className="valuesDiv">
                    <div>test 1</div>
                    <div>test 1</div>
                    <div>test 1</div>
                    <div>test 1</div>
                    <div>test 1</div>
                  </div>
                </div>
              )}
              {selectedType === "type4" && (
                <div className="typesMain2">
                  <button onClick={() => handleClick("type4")}>Type 4</button>
                  <div className="valuesDiv">
                    <div>test 1</div>
                    <div>test 1</div>
                    <div>test 1</div>
                    <div>test 1</div>
                    <div>test 1</div>
                  </div>
                </div>
              )}
              {selectedType === "type5" && (
                <div className="typesMain2">
                  <button onClick={() => handleClick("type5")}>Type 5</button>
                  <div className="valuesDiv">
                    <div>test 1</div>
                    <div>test 1</div>
                    <div>test 1</div>
                    <div>test 1</div>
                    <div>test 1</div>
                  </div>
                </div>
              )}
              {selectedType === "type6" && (
                <div className="typesMain2">
                  <button onClick={() => handleClick("type6")}>Type 6</button>
                  <div className="valuesDiv">
                    <div>test 1</div>
                    <div>test 1</div>
                    <div>test 1</div>
                    <div>test 1</div>
                    <div>test 1</div>
                  </div>
                </div>
              )}

              <div id="closeCategory" onClick={handleReset}>
                ✖
              </div>
            </>
          )}
        </div>

        {_loader > 0 ? (
          <div className="page-loader-main">
            <img
              className="loader"
              src="https://witch-8vg.pages.dev/imgs/witch.jpg"
            />
            <div className="loadTxt">LOADING NFTs</div>
            <div className="loadTxt2">{_loaded} %</div>
          </div>
        ) : (
          <div className="mintDetails">
            {/* existing JSX */}
            <div className="eachImgMain">
              {itemDatas.map((data, index) => (
                <div className="eachImg" key={index}>
                  <img src={data.uri} />
                  <p>{data.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pageNum">
          <button onClick={() => arrowFirst()} className="arrowFL">
            First
          </button>
          <button onClick={() => arrowPrevious()} className="EachNumber2">
            Previous
          </button>
          {pageIndexer()}
          <button onClick={() => arrowClicked()} className="EachNumber2">
            Next
          </button>
          <button onClick={() => arrowLast()} className="arrowFL">
            Last
          </button>
        </div>
      </div>
    </div>
  );
};
