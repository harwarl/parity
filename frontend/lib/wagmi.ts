import { http, createConfig } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

/**
 * Real wallet connectivity for the landing page's connect button — browser
 * extension wallets (MetaMask, Coinbase Wallet, etc.) via the injected
 * connector. No WalletConnect project id configured, so that connector is
 * omitted rather than shipped broken.
 */
export const wagmiConfig = createConfig({
  chains: [mainnet, base],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
  ssr: true,
});
