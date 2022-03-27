import { Button } from "@govtechsg/tradetrust-ui-components";
import { create } from "./ConfigCreate";
import { useState } from "react";
import { usePersistedWalletFile } from "../../../../common/hook/usePersistedWalletFile";
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ConfigFileCreator = () => {
  // Start file download.
  //   onClick={() => download("hello.txt", "This is the content of my file :)")}
  const [password, setPassword] = useState("");
  const handleChange = (event: { target: { value: any } }) => {
    setPassword(event.target.value);
  };
  const { walletFile } = usePersistedWalletFile();
  return (
    <div className="flex flex-col p-3 text-center">
      <div className="p-3">
        <h2>Step 3: Create your config.json file</h2>
        <form>
          <p>Key in the password of your wallet.json file:</p>
          <input type="text" onChange={handleChange} placeholder="Password" />
        </form>
      </div>
      <div>
        <Button
          disabled={password === "" || typeof walletFile === "undefined" ? true : false}
          className="bg-cerulean text-white hover:bg-cerulean-500 border-gray-300 block mx-auto mb-5"
          onClick={() =>
            create(
              { outputDir: "", encryptedWalletPath: walletFile, configTemplatePath: "", configTemplateUrl: "" },
              password
            )
          }
        >
          Create and download your config.json file
        </Button>
      </div>
    </div>
  );
};
