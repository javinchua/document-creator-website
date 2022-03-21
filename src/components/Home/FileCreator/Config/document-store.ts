import { DocumentStoreFactory } from "@govtechsg/document-store";
import { DeployDocumentStoreCommand } from "./deploy.types";
import { getWalletOrSigner } from "./utils";
import { dryRunMode } from "./utils";

export const deployDocumentStore = async (
  { storeName, network, gasPriceScale, dryRun, ...rest }: DeployDocumentStoreCommand,
  password: string
): Promise<{ contractAddress: string }> => {
  if (dryRun) {
    await dryRunMode({
      gasPriceScale: gasPriceScale,
      transaction: new DocumentStoreFactory().getDeployTransaction(storeName),
      network,
    });
    process.exit(0);
  }

  const wallet = await getWalletOrSigner({ network, ...rest }, password);
  const gasPrice = await wallet.provider.getGasPrice();
  const factory = new DocumentStoreFactory(wallet);
  console.log(`Sending transaction to pool`);
  const transaction = await factory.deploy(storeName, { gasPrice: gasPrice.mul(gasPriceScale) });
  console.log(`Tx hash: ${transaction.deployTransaction.hash}`);
  console.log(`Block Number: ${transaction.deployTransaction.blockNumber}`);
  console.log(`Waiting for transaction ${transaction.deployTransaction.hash} to be mined`);
  return transaction.deployTransaction.wait();
};
