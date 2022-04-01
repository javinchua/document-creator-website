import { Button } from "@govtechsg/tradetrust-ui-components";
import { FunctionComponent } from "react";
import { usePersistedWalletFile } from "../../../common/hook/usePersistedWalletFile";

interface IFundWallet {
  next: () => void;
}

export const FundWallet: FunctionComponent<IFundWallet> = ({ next }) => {
  const { walletFile } = usePersistedWalletFile();

  return (
    <div className="flex flex-col items-center p-3 text-center">
      <div className="p-3">
        <h2>Step 2: Fund your wallet</h2>
        <p className="mb-2">Deposit native currency of the network of your choice</p>
        <p className="mb-2">Your wallet address: 0x{walletFile?.address}</p>
        <div className="flex justify-around">
          <div className="flex flex-col items-center">
            <p>Ethereum</p>
            <img
              src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png"
              className="h-8"
            />
          </div>
          <div className="flex flex-col items-center">
            <p>Polygon</p>
            <img src="https://cdn.iconscout.com/icon/free/png-256/polygon-token-4086724-3379854.png" className="h-8" />
          </div>
        </div>
      </div>
      <div>
        <Button
          className="block mx-auto mb-5 text-white border-gray-300 bg-cerulean hover:bg-cerulean-500"
          onClick={() => next()}
        >
          Wallet Funded
        </Button>
      </div>
    </div>
  );
};
