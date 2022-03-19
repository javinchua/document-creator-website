import { ethers } from "ethers";
// import inquirer from "inquirer";
import fetch from "node-fetch";
import path from "path";
// import signale from "signale";
import { CreateWalletCommand } from "./wallet.type";
import chalk from "chalk";
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

export const create = async ({ fund, outputFile }: CreateWalletCommand, password: string): Promise<string> => {
  const wallet = ethers.Wallet.createRandom();
  const json = await wallet.encrypt(password);
  const outputPath = path.resolve(outputFile);
  // fs.writeFileSync(outputPath, json);
  downloadObjectAsJson(json, "wallet");

  if (fund === "ropsten") {
    const response = await fetch(`https://faucet.openattestation.com/donate/${wallet.address}`).then((res) =>
      res.json()
    );
    if (response.message) {
      console.log(`[ropsten] Adding fund to ${wallet.address} failed: ${response.message}`);
    } else {
      console.log(
        `[ropsten] Request to add funds into ${wallet.address} sent. Please wait a while before the funds being added into your wallet. You can check the transaction at https://ropsten.etherscan.io/tx/${response.txhash}`
      );
    }
  }
  console.log(`Wallet with public address ${highlight(wallet.address)} successfully created.`);
  console.log(`Find more details at ${getEtherscanAddress({ network: "ropsten" })}/address/${wallet.address}`);

  return outputPath;
};
