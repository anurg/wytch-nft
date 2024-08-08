// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';
import pkg from '../../../package.json';
import { CandyMint } from '../../components/CandyMint';
import { MyNFT } from 'components/MyNFT';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';
import { Footer } from 'components/Footer';
import { Footer2 } from 'components/Footer2';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (
    <div id="bgC" className="w-full mx-auto flex flex-col items-center">
      <div className="w-full flex flex-col items-center">
        <div className='mt-6 w-full flex justify-center'>
          <h1 id="mainT" className="text-center text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-900 mb-4">
            Witchezz Frenzy 2222
          </h1>
        </div>

        <div className="w-full text-center">
          <h4 id="subCon" className="text-2xl md:text-4xl text-slate-300 my-2">
            Collection of 5,100 unique witches NFTs.
          </h4>
          <p className='text-slate-500 text-2xl leading-relaxed' id="subP">
            Witchezz Frenzy are a collection of 5,100 unique witches NFTs. They are digital artworks of the vivid creepy moods of witches here to be taken by you
          </p>
        </div>
      </div>

      <div id="amountSol">
        <MyNFT />
      </div>


    </div>
  );
};
