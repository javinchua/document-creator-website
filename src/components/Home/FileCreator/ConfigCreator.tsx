import { Button } from "@govtechsg/tradetrust-ui-components";
import { create } from "./WalletCreate";
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ConfigCreator = () => {
  // Start file download.
  //   onClick={() => download("hello.txt", "This is the content of my file :)")}

  return (
    <>
      <Button
        className="bg-cerulean text-white hover:bg-cerulean-500 border-gray-300 block mx-auto mb-5"
        onClick={() => create({ fund: "ropsten", outputFile: "wallet.json" })}
      >
        Create and download your wallet.json file
      </Button>
    </>
  );
};
