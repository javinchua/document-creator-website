import createPersistedState from "use-persisted-state";
import { Wallet } from "ethers";

const useWalletFile = createPersistedState("WALLET_FILE");

export const usePersistedWalletFile = (): {
  walletFile?: Wallet;
  setWalletFile: (walletFile?: Wallet) => void;
} => {
  // Using empty object to initialize config file due to bug with deserializing "undefined"
  const [walletFileFromStorage, setWalletFileInStorage] = useWalletFile<Wallet | Record<string, null>>({});
  const walletFile = Object.keys(walletFileFromStorage).length === 0 ? undefined : (walletFileFromStorage as Wallet);
  const setWalletFile = (wallet?: Wallet): void => {
    setWalletFileInStorage(wallet ? wallet : {});
  };
  return { walletFile, setWalletFile };
};
