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

interface NFT {
    name: string;
    symbol: string;
    image: string;
    nftMetadata?: string;
}

export const MyNFT: FC = () => {
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
    const [showMyNFTs, set_showMyNFTs] = useState<NFT[]>([]);

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

            console.log("reading data : " + JSON.stringify(candyMachine.items[0]));

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
            fetchMyNFTS();

        }

        collection(_pageNo);

        console.log("UE_WL1 : " + _showWL1);
        console.log("UE_WL2 : " + _showWL2);
        console.log("UE_WL3 : " + _showWL3);

    }, [wallet.publicKey, connection, getUserSOLBalance, _showWL1, _showWL2, _showWL3, _pageNo])


    async function fetchMyNFTS() {

        // Create a Metaplex instance
        const metaplex = new Metaplex(connection);

        const myNfts = await metaplex.nfts().findAllByOwner({
            owner: wallet.publicKey/*metaplex.identity().publicKey*/
        });

        // 3ehuxJLxKVyLtmoz351DAFZNERai4UNqmTnsXnuSqeoy


        for (let x = 0; x < myNfts.length; x++) {
            let myNFTsArray: NFT[] = [...showMyNFTs];

            if (myNfts[x].symbol == "WF") {
                console.log("myNfts[x].uri : " + myNfts[x].uri);

                const response = await fetch(myNfts[x].uri);
                const data = await response.json();
                console.log("image_ : " + data.image);


                myNFTsArray.push({ name: data.name.toString(), symbol: data.symbol.toString(), image: data.image.toString(), nftMetadata: myNfts[x].uri.toString() });

                console.log("myNFTsArray : " + JSON.stringify(myNFTsArray[0].image));
            }

            set_showMyNFTs(myNFTsArray);

        }

        // console.log("My NFTs :" + JSON.stringify(myNfts));
    }



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
            

                <div className="mintDetails">
                    {/* existing JSX */}
                    <div className='eachImgMain'>
                        {showMyNFTs.map((data, index) => (
                            <div className='eachImg' key={index}>
                                <img src={data.image} />
                                <p>{data.name}</p>
                                <a href={data.nftMetadata} target="_blank" rel="noopener noreferrer"><div className='meta'>Metadata <img id="link" src="https://cdn-icons-png.flaticon.com/128/7268/7268615.png" /></div>  </a>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>

    );
};

