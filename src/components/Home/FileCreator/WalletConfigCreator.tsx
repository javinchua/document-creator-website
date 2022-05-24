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
    console.log("connecting");
    connectWeb3().then((res) => {
      setSigner(res);
      next();
    });
  };

  return (
    <div className="flex flex-col p-3 text-left">
      <h2>Connect a Web3 wallet</h2>
      <div className="flex flex-col justify-start my-4">
        <form>
          <h3>Option 1: Create a wallet file</h3>
          <p className="my-2">Please create a password for your wallet file, store this file securely.</p>
          <input
            type="password"
            onChange={handleChange}
            placeholder="Password"
            className="p-2 my-4 border-2 border-gray-400 rounded-lg"
          />
        </form>
        <div>
          <Button
            disabled={password === "" ? true : false}
            className="block mb-5 text-white border-gray-300 bg-cerulean hover:bg-cerulean-500"
            onClick={handleCreate}
          >
            Download
          </Button>
        </div>
      </div>
      <div className="flex flex-col justify-start my-4">
        <h3>Option 2: Use existing an Torus account</h3>
        <div>
          <Button
            className="block mt-4 mb-5 text-white border-gray-300 bg-cerulean hover:bg-cerulean-500"
            onClick={handleConnect}
          >
            Connect Account
          </Button>
        </div>
      </div>
    </div>
  );
};
