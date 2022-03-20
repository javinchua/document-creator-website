import { TradeTrustErc721Factory } from "@govtechsg/token-registry";
import { getWalletOrSigner } from "./utils";
import { TransactionReceipt } from "@ethersproject/providers";
import { DeployTokenRegistryCommand } from "./deploy.types";
import { dryRunMode } from "./utils";

export const deployTokenRegistry = async ({
  registryName,
  registrySymbol,
  network,
  gasPriceScale,
  dryRun,
  ...rest
}: DeployTokenRegistryCommand): Promise<TransactionReceipt> => {
  const wallet = await getWalletOrSigner({ network, ...rest });
  const factory = new TradeTrustErc721Factory(wallet);
  if (dryRun) {
    const unsignedTx = factory.getDeployTransaction(registryName, registrySymbol, {});
    const tx = await wallet.populateTransaction(unsignedTx);
    await dryRunMode({
      network,
      gasPriceScale: gasPriceScale,
      transaction: tx,
    });
    process.exit(0);
  }
  const gasPrice = await wallet.provider.getGasPrice();
  console.log(`Sending transaction to pool`);
  const transaction = await factory.deploy(registryName, registrySymbol, { gasPrice: gasPrice.mul(gasPriceScale) });
  console.log(`Tx hash: ${transaction.deployTransaction.hash}`);
  console.log(`Block Number: ${transaction.deployTransaction.blockNumber}`);
  console.log(`Waiting for transaction ${transaction.deployTransaction.hash} to be mined`);
  return transaction.deployTransaction.wait();
};
