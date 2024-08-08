import { FC } from 'react';
import Link from "next/link";
import dynamic from 'next/dynamic';
import React, { useState } from "react";
import { useAutoConnect } from '../contexts/AutoConnectProvider';
import NetworkSwitcher from './NetworkSwitcher';
import NavElement from './nav-element';
import me from '../assets/magiceden.png';

const meL = () => {
	window.open("#");
}

const tg = () => {
	window.open("#");
}

const tweet = () => {
	window.open("#");
}

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const AppBar: React.FC = () => {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  return (
    <div>
      {/* NavBar / Header */}
      <div className="navbar flex flex-row md:mb-2 shadow-lg bg-black text-neutral-content border-b border-zinc-600 bg-opacity-66">
        <div className="navbar-start align-items-center">
          <div className="hidden sm:inline w-22 h-22 md:p-2 ml-10">
          <img className='logo' src="https://witch-8vg.pages.dev/imgs/witch.jpg"/>
           </div>
          <WalletMultiButtonDynamic className="btn-ghost btn-sm relative flex md:hidden text-lg " />

        </div>

        {/* Nav Links */}
        {/* Wallet & Settings */}
        <div className="navbar-end">
          <div className="hidden md:inline-flex align-items-center justify-items gap-6">
          <img className='me' onClick={meL} src="https://optimusassets.pages.dev/imgs/magiceden.png"/>
           <img className='me' src="https://social-c3e.pages.dev/imgs/twitter (1).png" onClick={tweet}/>
          <img className='me' src="https://social-op.pages.dev/imgs/telegram.png" onClick={tg}/>
          <div className='mynft'>MY NFTs</div>

          <WalletMultiButtonDynamic className="btn-ghost btn-sm rounded-btn text-lg mr-6 " />

          
        </div>
  
        <div className="dropdown dropdown-end">
           
          <ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-base-100 rounded-box sm:w-52">
            <li>
              <div className="form-control bg-opacity-100">
                <label className="cursor-pointer label">
                  <a>Autoconnect</a>
                  <input type="checkbox" checked={autoConnect} onChange={(e) => setAutoConnect(e.target.checked)} className="toggle" />
                </label>
              </div>
            </li>
          </ul>
        </div>
        </div>
      </div>
    </div>
  );
};
