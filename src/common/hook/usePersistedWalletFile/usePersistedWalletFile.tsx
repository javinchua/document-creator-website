import createPersistedState from "use-persisted-state";
import { Wallet } from "ethers";

const useWalletFile = createPersistedState<Wallet>("WALLET_FILE");

export const usePersistedWalletFile = (): {
  walletFile?: Wallet;
  setWalletFile: (walletFile?: Wallet) => void;
} => {
  const [walletFileFromStorage, setWalletFileInStorage] = useWalletFile();
  const walletFile = Object.keys(walletFileFromStorage as Wallet).length === 0 ? undefined : walletFileFromStorage;
  const setWalletFile = (wallet?: Wallet): void => {
    setWalletFileInStorage(wallet);
  };
  return { walletFile, setWalletFile };
};
