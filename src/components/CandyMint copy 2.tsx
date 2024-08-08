import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback, useMemo, useState, useEffect } from 'react';
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, transactionBuilder, publicKey, some } from '@metaplex-foundation/umi';
import { TokenPaymentMintArgs, fetchCandyMachine, mintV2, mplCandyMachine, route, safeFetchCandyGuard } from "@metaplex-foundation/mpl-candy-machine";
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { fetchMetadata, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import * as bs58 from 'bs58';
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox';
import { getMerkleProof, getMerkleRoot } from "@metaplex-foundation/mpl-candy-machine";
import axios from 'axios';
import { FindNftByMintInput, Metaplex } from '@metaplex-foundation/js';
import { url } from 'inspector';
import { Footer2 } from './Footer2';

const allowList = [
    "B2v1qMJpVSt2HBbgLrfT1pHgC5PEHcUNoSwZeYta5E7r"
];

//You can create various allow lists as you like

const allowList2 = [
    "7vUZFgxJ8hfmvURCptqzhDoFEGb4Xq2YL7vmmEKuuB2V"
]

const allowList3 = [
    "87tCnUjypUfiboXXBoo5PtDuZG2BNdH85C9z4SZBUtjJ"
];


const quicknodeEndpoint = process.env.NEXT_PUBLIC_RPC/* || clusterApiUrl('devnet')*/;
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
    const [mintedImg, setMintedImg] = useState<string>('');
    const [imageID, setImageID] = useState<string>('');
    const [itemDatas, setItemDatas] = useState<ItemData[]>([]);
    const [_showWL1, setShowWL1] = useState(false);
    const [_showWL2, setShowWL2] = useState(false);
    const [_showWL3, setShowWL3] = useState(false);
    const [_pageNo, setPageNo] = useState(1);
    const [activePage, setActivePage] = useState(1);

    const handleMintClick = () => {
        setShowMintOptions(true);
    };

    const umi = useMemo(() =>
        createUmi(quicknodeEndpoint)
            .use(walletAdapterIdentity(wallet))
            .use(mplCandyMachine())
            .use(mplTokenMetadata()),
        [wallet, mplCandyMachine, walletAdapterIdentity, mplTokenMetadata, quicknodeEndpoint, createUmi]
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
                .add(setComputeUnitLimit(umi, { units: 800_000 })

                    .add(nft));


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

    const WLMint = useCallback(async () => {
        if (!wallet.publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }

        try {
            // Fetch the Candy Machine.
            const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
            if (!candyMachine) {
                console.error('Candy Machine not found!');
                notify({ type: 'error', message: 'Candy Machine not found!' });
                return;
            }

            // Fetch the Candy Guard.
            const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
            if (!candyGuard) {
                console.error('Candy Guard is not initialized!');
                notify({ type: 'error', message: 'Candy Guard is not initialized!' });
                return;
            }

            // Pre-validate the wallet
            const root = getMerkleRoot(allowList);
            const proof = getMerkleProof(allowList, publicKey(umi.identity));

            console.log("root : " + root);
            console.log("proof : " + proof);
            console.log("umi : " + (publicKey(umi.identity)));

            await route(umi, {
                candyMachine: candyMachine.publicKey,
                candyGuard: candyGuard.publicKey,
                group: some('wl'), // you have to mention the relevant group here
                guard: "allowList",
                routeArgs: {
                    path: "proof",
                    merkleRoot: root,
                    merkleProof: proof,
                },
            }).sendAndConfirm(umi);

            const rootHex = Buffer.from(root).toString('hex');
            console.log('Root (hex): ' + rootHex);

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
                        group: some('wl'), // you have to mention the relevant group here

                        mintArgs: {
                            allowList: some({ merkleRoot: root }),
                            mintLimit: some({ id: 1 }),
                        },
                    }));


            const { signature } = await transaction.sendAndConfirm(umi, {
                confirm: { commitment: "confirmed" },
            });
            const txid = bs58.encode(signature);
            console.log('success', `Mint successful! ${txid}`)
            notify({ type: 'success', message: 'Mint successful!', txid });

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
            console.log('error', 'An error occurred:', error);
            notify({ type: 'error', message: 'An error occurred!', description: error.message });
        }
    }, [wallet, umi, candyMachineAddress, allowList, setItemsRedeemed]);

    const WLMint2 = useCallback(async () => {
        if (!wallet.publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }

        try {
            // Fetch the Candy Machine.
            const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
            if (!candyMachine) {
                console.error('Candy Machine not found!');
                notify({ type: 'error', message: 'Candy Machine not found!' });
                return;
            }

            // Fetch the Candy Guard.
            const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
            if (!candyGuard) {
                console.error('Candy Guard is not initialized!');
                notify({ type: 'error', message: 'Candy Guard is not initialized!' });
                return;
            }

            // Pre-validate the wallet
            const root = getMerkleRoot(allowList2);
            const proof = getMerkleProof(allowList2, publicKey(umi.identity));

            console.log("root : " + root);
            console.log("proof : " + proof);
            console.log("umi : " + (publicKey(umi.identity)));

            await route(umi, {
                candyMachine: candyMachine.publicKey,
                candyGuard: candyGuard.publicKey,
                group: some('wl2'), // you have to mention the relevant group here
                guard: "allowList",
                routeArgs: {
                    path: "proof",
                    merkleRoot: root,
                    merkleProof: proof,
                },
            }).sendAndConfirm(umi);

            const rootHex = Buffer.from(root).toString('hex');
            console.log('Root (hex): ' + rootHex);

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
                        group: some('wl2'), // you have to mention the relevant group here

                        mintArgs: {
                            allowList: some({ merkleRoot: root }),
                            mintLimit: some({ id: 2 }),
                        },
                    }));


            const { signature } = await transaction.sendAndConfirm(umi, {
                confirm: { commitment: "confirmed" },
            });
            const txid = bs58.encode(signature);
            console.log('success', `Mint successful! ${txid}`)
            notify({ type: 'success', message: 'Mint successful!', txid });

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
            console.log('error', 'An error occurred:', error);
            notify({ type: 'error', message: 'An error occurred!', description: error.message });
        }
    }, [wallet, umi, candyMachineAddress, allowList2, setItemsRedeemed]);

    const WLMint3 = useCallback(async () => {
        if (!wallet.publicKey) {
            console.log('error', 'Wallet not connected!');
            notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
            return;
        }

        try {
            // Fetch the Candy Machine.
            const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
            if (!candyMachine) {
                console.error('Candy Machine not found!');
                notify({ type: 'error', message: 'Candy Machine not found!' });
                return;
            }

            // Fetch the Candy Guard.
            const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
            if (!candyGuard) {
                console.error('Candy Guard is not initialized!');
                notify({ type: 'error', message: 'Candy Guard is not initialized!' });
                return;
            }

            // Pre-validate the wallet
            const root = getMerkleRoot(allowList3);
            const proof = getMerkleProof(allowList3, publicKey(umi.identity));

            console.log("root : " + root);
            console.log("proof : " + proof);
            console.log("umi : " + (publicKey(umi.identity)));

            await route(umi, {
                candyMachine: candyMachine.publicKey,
                candyGuard: candyGuard.publicKey,
                group: some('wl3'), // you have to mention the relevant group here
                guard: "allowList",
                routeArgs: {
                    path: "proof",
                    merkleRoot: root,
                    merkleProof: proof,
                },
            }).sendAndConfirm(umi);

            const rootHex = Buffer.from(root).toString('hex');
            console.log('Root (hex): ' + rootHex);

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
                        group: some('wl3'), // you have to mention the relevant group here

                        mintArgs: {
                            allowList: some({ merkleRoot: root }),
                            mintLimit: some({ id: 3 }),
                        },
                    }));


            const { signature } = await transaction.sendAndConfirm(umi, {
                confirm: { commitment: "confirmed" },
            });
            const txid = bs58.encode(signature);
            console.log('success', `Mint successful! ${txid}`)
            notify({ type: 'success', message: 'Mint successful!', txid });

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
            console.log('error', 'An error occurred:', error);
            notify({ type: 'error', message: 'An error occurred!', description: error.message });
        }
    }, [wallet, umi, candyMachineAddress, allowList3, setItemsRedeemed]);

    //....................................................................................//

    async function candyTime() {
        // Fetch the Candy Machine.
        const candyMachine = await fetchCandyMachine(
            umi,
            candyMachineAddress,
        );

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

        for (let x = 0; x < 10; x++) {
            console.log("candyMachine.items :" + JSON.stringify(candyMachine.items[x]));
        }

        // Fetch the Candy Guard.
        const candyGuard = await safeFetchCandyGuard(
            umi,
            candyMachine.mintAuthority,
        );

        console.log("SOL Payment :" + (candyGuard.guards.solPayment.__option));

    }

    async function collection(pageNo) {

        const candyMachine = await fetchCandyMachine(
            umi,
            candyMachineAddress,
        );

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


            console.log("pageNo : " + pageNo);
            let o = ((pageNo - 1) * 4);


            for (let x = o; x < candyMachine.items.length && x < pageNo * 4; x++) {

                var imageURL = await allImgs(candyMachine.items[x].uri);
                console.log("INSIDE :" + imageURL);

                var notUrl = 'https://witch-8vg.pages.dev/imgs/witch.jpg';

                itemDataArray.push({
                    name: candyMachine.items[x].name,
                    uri: candyMachine.items[x].minted ?

                        imageURL
                        : notUrl,
                });
            }

            setItemDatas(itemDataArray);

        }

        console.log(`Collection function called with page number: ${pageNo}`);


    }

    async function fetchImg(uri) {

        fetch(uri)
            .then(response => response.json())
            .then(data => console.log(data.image))
            .catch(error => console.error('Error:', error));
    }

    async function allImgs(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log("ALL : " + data.image);

            return data.image;

        } catch (error) {
            console.error('Error:', error);
            throw error; // re-throw the error so that the caller can handle it if needed
        }
    }

    async function pages(pageNo) {
        let galleryShow1 = [];

        console.log("pageNo : " + pageNo);
        let o = ((pageNo - 1) * 60);

        for (let i = o; i < o + 60; i++) {
            galleryShow1[i] = i + 1;
        }

        this.setState({ _galleryShow1: galleryShow1 });
        this.setState({ _images1: 1 });
        this.serSrare({ _pageSelected: pageNo });

    }

    useEffect(() => {
        if (wallet.publicKey) {
            console.log(wallet.publicKey.toBase58())
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

    }, [wallet.publicKey, connection, getUserSOLBalance, _showWL1, _showWL2, _showWL3, _pageNo])


    const pageIndexer = () => {
        let pageIndexes = [];
        for (let x = 0; x < 4; x++) {
            const pageNum = x + 1;
            pageIndexes.push(
                <div 
                    key={x} 
                    onClick={() => collection(pageNum)} 
                    className={pageNum === activePage ? 'EachNumber active' : 'EachNumber'}
                >
                    {pageNum}
                </div>
            );
        }
        return pageIndexes;
    };


    return (

        <div className="mintDetails">
            <div>
                <div id='price'>Minted {_itemsRedeemed}/5100</div>
                <div id='price'><span className='price2'>Price: 0.01 SOL</span></div>

                <p></p>

                <div className='btns3'>
                    <button className='gradient-button' onClick={publicMint}>Public Mint</button>

                    {_showWL1 ?
                        <button className='gradient-button' onClick={WLMint}>Special Mint 1</button> :
                        null}

                    {_showWL2 ?
                        <button className='gradient-button' onClick={WLMint2}>Special Mint 2</button> :
                        null}

                    {_showWL3 ?
                        <button className='gradient-button' onClick={WLMint3}>Special Mint 3</button> :
                        null}

                </div>

                {mintedImg ?
                    <div className='mintSection'>
                        <div className='idAmount'>{imageID}</div>
                        <img src={mintedImg} className='mintedNFT' alt="NFT Image" />
                    </div> : null}

                <Footer2 />

                <div className='imgs2Main'>
                    <img className='witch1' src='https://imgswitch.pages.dev/imgs/1.png' />
                    <img className='witch2' src='https://imgswitch.pages.dev/imgs/2.png' />
                </div>

                <div className="mintDetails">
                    {/* existing JSX */}
                    <div className='eachImgMain'>
                        {itemDatas.map((data, index) => (
                            <div className='eachImg' key={index}>
                                <img src={data.uri} />
                                <p>{data.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='pageNum'>
                    {pageIndexer()}
                </div>

            </div>

        </div>

    );
};

