import { Button } from "@govtechsg/tradetrust-ui-components";
import { create } from "./ConfigCreate";
import { useState, FunctionComponent } from "react";
import { usePersistedWalletFile } from "../../../../common/hook/usePersistedWalletFile";
import { CircularProgress } from "@material-ui/core";
import { Signer } from "ethers";
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

export interface JsonProps {
  jsonConfig: any;
  next: () => void;
  signer?: Signer;
}
export const ConfigFileCreator: FunctionComponent<JsonProps> = ({ jsonConfig, next, signer }) => {
  // Start file download.
  //   onClick={() => download("hello.txt", "This is the content of my file :)")}
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const { walletFile } = usePersistedWalletFile();
  const handleChange = (event: { target: { value: any } }) => {
    setPassword(event.target.value);
  };
  const handleCreate = () => {
    setCreating(true);
    create({ outputDir: "", encryptedWalletPath: walletFile, configTemplatePath: jsonConfig, signer }, password).then(
      () => {
        setCreating(false);
        next();
      }
    );
  };
  return (
    <div className="flex flex-col p-3 text-center">
      <div className="p-3">
        <h2 className="underline">Step 4</h2>
        <h2 className="italic">Create your form configuration file</h2>
        {!signer && (
          <form>
            <p className="mb-4">Please enter the password of your wallet file</p>
            <input type="password" onChange={handleChange} placeholder="Password" />
          </form>
        )}
      </div>
      <div>
        <Button
          disabled={(!signer && (password === "" || typeof walletFile === "undefined")) || creating}
          className="block w-24 mx-auto mb-5 text-white border-gray-300 bg-cerulean hover:bg-cerulean-500"
          onClick={handleCreate}
        >
          {creating ? <CircularProgress size={18} /> : "Download"}
        </Button>
      </div>
    </div>
  );
};
