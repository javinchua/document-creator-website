import { Button, Dropdown } from "@govtechsg/tradetrust-ui-components";
import { Signer } from "ethers";
import { FunctionComponent, useEffect, useState } from "react";
import { usePersistedWalletFile } from "../../../common/hook/usePersistedWalletFile";

interface IFundWallet {
  next: () => void;
  signer?: Signer;
}
interface DropdownItemLabelProps {
  network: any;
}
const itemsList = [
  {
    image: "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png",
    name: "Ethereum",
  },
  {
    image: "https://cdn.iconscout.com/icon/free/png-256/polygon-token-4086724-3379854.png",
    name: "MATIC",
  },
];
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
  const DropdownItemLabel: FunctionComponent<DropdownItemLabelProps> = ({ network }) => {
    return (
      <div className="flex items-center" data-testid={`network-select-dropdown-label-`}>
        <img className="mr-2 w-5 h-5 rounded-full" src={network.image} alt={network.name} />
        <span className="w-full">{network.name}</span>
        <span className="m-1 p-1 bg-forest-500 rounded-lg justify-self-end" />
      </div>
    );
  };
  return (
    <div className="flex flex-col items-start p-3">
      <h2>Fund your wallet</h2>
      <p className="mb-2">Deposit currency of the network that the document will be issued on</p>
      <p>Your wallet address: </p>
      <p className="mb-4 font-bold">{address || walletFile?.address}</p>
      <div className="flex flex-col items-center w-full">
        {/* <div className="flex justify-around w-full"> */}
        <div className="flex flex-row text-sm" style={{ minWidth: "12.5em" }}>
          <span className="mr-3 my-auto">Select your network:</span>
          <Dropdown
            className="rounded-md py-1 pl-4 p-2 border border-gray-300 bg-white w-[173px]"
            data-testid="network-selector"
            dropdownButtonText={<DropdownItemLabel network={itemsList[0]} />}
          >
            <div className="w-[173px]">
              <span className="text-cloud-500 p-3 pr-8 cursor-default">Select a Network</span>
              {itemsList.map((item, idx) => (
                <div className="flex items-center px-3 p-1" key={idx} data-testid={`network-select-dropdown-label-`}>
                  <img className="mr-2 w-5 h-5 rounded-full" src={item.image} alt={item.name} />
                  <span className="w-full">{item.name}</span>
                  <span className="m-1 p-1 bg-green-500 rounded-lg justify-self-end" />
                </div>
              ))}
            </div>
          </Dropdown>
        </div>
        {/* <div className="flex flex-col items-center">
            <p className="mb-2 font-bold">Ethereum</p>
            <img
              src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png"
              className="h-8 mb-2"
            />
            <p>ETH</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="mb-2 font-bold">Polygon</p>
            <img
              src="https://cdn.iconscout.com/icon/free/png-256/polygon-token-4086724-3379854.png"
              className="h-8 mb-2"
            />
            <p>MATIC</p>
          </div> */}
        {/* </div> */}
        <div className="mt-4">
          <Button
            className="block mx-auto mb-5 text-white border-gray-300 bg-cerulean hover:bg-cerulean-500"
            onClick={() => next()}
          >
            Wallet Funded
          </Button>
        </div>
      </div>
    </div>
  );
};
