import { Button } from "@govtechsg/tradetrust-ui-components";
import { Signer } from "ethers";
import { FunctionComponent, useEffect, useState } from "react";
import { usePersistedWalletFile } from "../../../common/hook/usePersistedWalletFile";

interface IFundWallet {
  next: () => void;
  signer?: Signer;
}

export const FundWallet: FunctionComponent<IFundWallet> = ({ next, signer }) => {
  const { walletFile } = usePersistedWalletFile();
  const [address, setAddress] = useState<string>();
  useEffect(() => {
    const getAddr = async () => {
      const addr = await signer?.getAddress();
      setAddress(addr);
    };
    if (signer) getAddr();
  }, [signer]);

  return (
    <div className="flex flex-col items-center p-3 text-center">
      <div className="p-3">
        <h2>Step 2: Fund your wallet</h2>
        <p className="mb-2">Deposit native currency of the network of your choice</p>
        <p className="mb-2">Your wallet address: {address || walletFile?.address}</p>
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
