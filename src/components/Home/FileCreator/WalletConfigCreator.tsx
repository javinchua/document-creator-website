import { Button } from "@govtechsg/tradetrust-ui-components";
import { create, connectWeb3 } from "./WalletCreate";
import { FunctionComponent, useState } from "react";
import { usePersistedWalletFile } from "../../../common/hook/usePersistedWalletFile";
import { Signer } from "ethers";

interface IWalletConfigCreator {
  next: () => void;
  setSigner: React.Dispatch<React.SetStateAction<Signer | undefined>>;
}

export const WalletConfigCreator: FunctionComponent<IWalletConfigCreator> = ({ next, setSigner }) => {
  const [password, setPassword] = useState("");
  const { setWalletFile } = usePersistedWalletFile();
  const handleChange = (event: { target: { value: any } }) => {
    setPassword(event.target.value);
  };
  const handleCreate = () => {
    create(password).then((res) => {
      setWalletFile(res);
      next();
    });
  };
  const handleConnect = () => {
    connectWeb3().then((res) => {
      setSigner(res);
      next();
    });
  };

  return (
    <div className="flex flex-col p-3 text-center">
      <div className="p-3">
        <h2>Step 1: Create a wallet file</h2>
        <form>
          <p className="mb-2">Please create a password for you wallet file</p>
          <p className="mb-2">Please keep this wallet file safe</p>
          <input type="password" onChange={handleChange} placeholder="password" />
        </form>
      </div>
      <div>
        <Button
          disabled={password === "" ? true : false}
          className="block mx-auto mb-5 text-white border-gray-300 bg-cerulean hover:bg-cerulean-500"
          onClick={handleCreate}
        >
          Download
        </Button>
        <Button
          className="block mx-auto mb-5 text-white border-gray-300 bg-cerulean hover:bg-cerulean-500"
          onClick={handleConnect}
        >
          Connect Web3
        </Button>
      </div>
    </div>
  );
};
