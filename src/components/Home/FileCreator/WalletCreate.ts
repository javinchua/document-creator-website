import { ethers, Wallet, Signer } from "ethers";
// import inquirer from "inquirer";
// import signale from "signale";
import chalk from "chalk";
import Web3Modal from "web3modal";
// import { Signale } from "signale";

// const interactive = new Signale({ interactive: true, scope: "" });

// export const defaultProgress =
//   (message: string) =>
//   (progress: number): void => {
//     if (process.env.DISABLE_PROGRESS_BAR) return;
//     const stepInPercentage = 5; // one dot = 5%
//     const numberOfSteps = 100 / stepInPercentage;
//     const numberOfStepsDone = Math.floor((progress * 100) / stepInPercentage);
//     const numberOfStepsLeft = numberOfSteps - numberOfStepsDone;
//     interactive.await(
//       `${message} [${"=".repeat(numberOfStepsDone)}${"-".repeat(numberOfStepsLeft)}] [%d/100%]`,
//       (progress * 100).toFixed()
//     );
//   };

export const getEtherscanAddress = ({ network }: { network: string }): string =>
  `https://${network === "mainnet" ? "" : `${network}.`}etherscan.io`;

const orange = chalk.hsl(39, 100, 50);
export const highlight = orange.bold;

function downloadObjectAsJson(exportObj: any, exportName: string) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export const create = async (password: string): Promise<Wallet> => {
  const wallet = ethers.Wallet.createRandom();
  const json = await wallet.encrypt(password);
  // fs.writeFileSync(outputPath, json);
  downloadObjectAsJson(json, "wallet");

  console.log(`Wallet with public address ${highlight(wallet.address)} successfully created.`);
  console.log(`Find more details at ${getEtherscanAddress({ network: "ropsten" })}/address/${wallet.address}`);

  return JSON.parse(json);
};

export const connectWeb3 = async (): Promise<Signer> => {
  const web3Modal = new Web3Modal({
    providerOptions: {
      torus: {
        package: require("@toruslabs/torus-embed"),
        options: {
          networkParams: {
            host: "https://matic-mumbai.chainstacklabs.com",
            chainId: 80001,
            networkId: 80001,
          },
        },
      },
    },
    disableInjectedProvider: true,
  });
  const instance = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(instance);
  const signer = provider.getSigner();
  return signer;
};
