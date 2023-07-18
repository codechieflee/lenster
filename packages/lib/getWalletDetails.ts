import { STATIC_IMAGES_URL } from '@lenster/data/constants';

interface WalletDetails {
  name: string;
  logo: string;
}

/**
 * Returns an object with the name and logo URL for the specified wallet name.
 *
 * @param name The wallet name.
 * @returns An object with the name and logo URL.
 */
const getWalletDetails = (name: string): WalletDetails => {
  const walletDetails: Record<string, WalletDetails> = {
    WalletConnect: {
      name: 'WalletConnect',
      logo: `${STATIC_IMAGES_URL}/wallets/walletconnect.svg`
    },
    'Coinbase Wallet': {
      name: 'Coinbase Wallet',
      logo: `${STATIC_IMAGES_URL}/wallets/coinbase.svg`
    }
  };
  const defaultDetails: WalletDetails = {
    name,
    logo: `${STATIC_IMAGES_URL}/wallets/browser-wallet.svg`
  };

  return walletDetails[name] || defaultDetails;
};

export default getWalletDetails;
