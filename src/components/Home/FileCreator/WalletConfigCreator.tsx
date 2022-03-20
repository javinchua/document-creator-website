import { Button } from "@govtechsg/tradetrust-ui-components";
import { create } from "./WalletCreate";
import { useState } from "react";
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const WalletConfigCreator = () => {
  // Start file download.
  //   onClick={() => download("hello.txt", "This is the content of my file :)")}
  const [password, setPassword] = useState("");
  const handleChange = (event: { target: { value: any } }) => {
    setPassword(event.target.value);
  };
  return (
    <div className="flex flex-col p-3 text-center">
      <div className="p-3">
        <form>
          <p>Key in the password of your wallet.json file:</p>
          <input type="text" onChange={handleChange} placeholder="Password" />
        </form>
      </div>
      <div>
        <Button
          disabled={password === "" ? true : false}
          className="bg-cerulean text-white hover:bg-cerulean-500 border-gray-300 block mx-auto mb-5"
          onClick={() => create({ fund: "ropsten", outputFile: "wallet.json" }, password)}
        >
          Create and download your wallet.json file
        </Button>
      </div>
    </div>
  );
};
