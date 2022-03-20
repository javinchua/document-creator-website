import { DocumentStoreFactory } from "@govtechsg/document-store";
import signale from "signale";
import { DeployDocumentStoreCommand } from "./deploy.types";
import { getWalletOrSigner } from "./utils";
import { dryRunMode } from "./utils";

export const deployDocumentStore = async ({
  storeName,
  network,
  gasPriceScale,
  dryRun,
  ...rest
}: DeployDocumentStoreCommand): Promise<{ contractAddress: string }> => {
  if (dryRun) {
    await dryRunMode({
      gasPriceScale: gasPriceScale,
      transaction: new DocumentStoreFactory().getDeployTransaction(storeName),
      network,
    });
    process.exit(0);
  }

  const wallet = await getWalletOrSigner({ network, ...rest });
  const gasPrice = await wallet.provider.getGasPrice();
  const factory = new DocumentStoreFactory(wallet);
  signale.await(`Sending transaction to pool`);
  const transaction = await factory.deploy(storeName, { gasPrice: gasPrice.mul(gasPriceScale) });
  console.log(`Tx hash: ${transaction.deployTransaction.hash}`);
  console.log(`Block Number: ${transaction.deployTransaction.blockNumber}`);
  signale.await(`Waiting for transaction ${transaction.deployTransaction.hash} to be mined`);
  return transaction.deployTransaction.wait();
};
