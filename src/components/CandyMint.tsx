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

const allowList = [
    "7SFwqFDjoQuNujWAYCbYiBguZ2oc5iTK7Fdi1DTSfeHs",
    "Cd87CYx3ZyxXP54mZana8CRi7YU6rwQF3CwonJcVU2oA",
    "Hvr9fMa2VGSSHwpPqjeLJUqjnea4yWkEhiRLFBptJ6jN"
];

//You can create various allow lists as you like

const allowList2 = [
    "FbbiXQcEzwSw8MSiNCmUHQ3DsZ93zFYhSuXua1RQ4WKg",
    "GtHEtBLxmNjF4xW4dosXYXpJfKCR41VWUbX3DfGogfCV",
    "8PpVMS6bB7VHz4pPVokaqeXTL66xQsLwG2AEhuPUpXPv"
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

    async function collection() {
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

        if (wallet.publicKey && connection) {
            const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
            let itemDataArray: ItemData[] = [];

            for (let x = 0; x < candyMachine.items.length && x < 10; x++) {

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

    useEffect(() => {
        if (wallet.publicKey) {
            console.log(wallet.publicKey.toBase58())
            getUserSOLBalance(wallet.publicKey, connection)

            candyTime();

        }

        collection();

    }, [wallet.publicKey, connection, getUserSOLBalance])

    return (

        <div className="mintDetails">
            <div>
                <div id='price'>Price: 0.1 SOL</div>
                <p></p>
                <div className='btns3'>
                    <button className='gradient-button' onClick={publicMint}>Public Mint</button>
                    <button className='gradient-button' onClick={WLMint}>Special Mint</button>
                </div>

                {mintedImg ?
                    <div className='mintSection'>
                        <div className='idAmount'>{imageID}</div>
                        <img src={mintedImg} className='mintedNFT' alt="NFT Image" />
                    </div> : null}

                <div className="mintDetails">
                    {/* existing JSX */}
                    <div className='eachImgMain'>
                        {itemDatas.map((data, index) => (
                            <div className='eachImg' key={index}>
                                <img src={data.uri}/>
                                 <p>{data.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>

    );
};

