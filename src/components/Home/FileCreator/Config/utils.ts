import { readFileSync } from "fs";
import { ethers, getDefaultProvider, providers, Signer, Wallet, utils } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import fs from "fs";
import {
  isAwsKmsSignerOption,
  isWalletOption,
  NetworkOption,
  PrivateKeyOption,
  WalletOrSignerOption,
  isInjected,
} from "./shared";
import { AwsKmsSigner } from "ethers-aws-kms-signer";
import fetch from "node-fetch";
import { BigNumber } from "ethers";
import { TransactionRequest } from "@ethersproject/providers";
import chalk from "chalk";

const orange = chalk.hsl(39, 100, 50);
export const highlight = orange.bold;
export const red = chalk.hsl(360, 100, 50).bold;
export const green = chalk.hsl(123, 100, 50).bold;
export const addAddressPrefix = (address: string): string => (address.startsWith("0x") ? address : `0x${address}`);
export const readFile = (filename: string): any => {
  return fs.readFileSync(filename, "utf8");
};
const getKeyFromFile = (file?: string): undefined | string => {
  return file ? readFileSync(file).toString().trim() : undefined;
};

export type ConnectedSigner = Signer & {
  readonly provider: Provider;
  readonly publicKey?: never;
  readonly privateKey?: never;
};

export const getPrivateKey = ({ keyFile, key }: PrivateKeyOption): string | undefined => {
  if (key) {
    console.warn(
      "Be aware that by using the `key` parameter, the private key may be stored in your machine's sh history"
    );
    console.warn(
      "Other options are available: using a file with `key-file` option or using `OA_PRIVATE_KEY` environment variable"
    );
  }
  return key || getKeyFromFile(keyFile) || process.env["OA_PRIVATE_KEY"];
};

export const getWalletOrSigner = async (
  { network, ...options }: WalletOrSignerOption & Partial<NetworkOption>,
  password?: string
): Promise<Wallet | ConnectedSigner> => {
  const provider =
    network === "local"
      ? new providers.JsonRpcProvider()
      : network === "maticmum"
      ? new providers.JsonRpcProvider("https://matic-mumbai.chainstacklabs.com")
      : getDefaultProvider(network === "mainnet" ? "homestead" : network); // homestead => aka mainnet
  if (isWalletOption(options) && password) {
    // const { password } = await inquirer.prompt({ type: "password", name: "password", message: "Wallet password" });
    const file = JSON.stringify(options.encryptedWalletPath);
    const wallet = await ethers.Wallet.fromEncryptedJson(file, password);
    console.log("Wallet successfully decrypted");
    return wallet.connect(provider);
  } else if (isAwsKmsSignerOption(options)) {
    const kmsCredentials = {
      accessKeyId: options.accessKeyId, // credentials for your IAM user with KMS access
      secretAccessKey: options.secretAccessKey, // credentials for your IAM user with KMS access
      region: options.region,
      keyId: options.kmsKeyId,
    };

    const signer = new AwsKmsSigner(kmsCredentials).connect(provider);
    if (signer.provider) return signer as unknown as ConnectedSigner;
    throw new Error("Unable to attach the provider to the kms signer");
  } else if (isInjected(options)) {
    return options.injected as ConnectedSigner;
  } else {
    const privateKey = getPrivateKey(options as any);

    if (privateKey) {
      const hexlifiedPrivateKey = addAddressPrefix(privateKey);
      return new Wallet(hexlifiedPrivateKey, provider);
    }
  }
  throw new Error(
    "No private key found in OA_PRIVATE_KEY, key, key-file, please supply at least one or supply an encrypted wallet path, or provide aws kms signer information"
  );
};

export const dryRunMode = async ({
  gasPriceScale,
  transaction,
  estimatedGas,
  network,
}: {
  gasPriceScale: number;
  network: string;
  transaction?: TransactionRequest;
  estimatedGas?: BigNumber;
}): Promise<void> => {
  // estimated gas or a transaction must be provided, if a transaction is provided let's estimate the gas automatically
  // the transaction is run on the provided network
  let _estimatedGas = estimatedGas;
  if (!estimatedGas && transaction) {
    const provider = ethers.getDefaultProvider(network);
    _estimatedGas = await provider.estimateGas(transaction);
  }
  if (!_estimatedGas) {
    throw new Error("Please provide estimatedGas or transaction");
  }

  // get gas price on mainnet
  const { fast, fastest, safeLow, average } = await fetch("https://ethgasstation.info/api/ethgasAPI.json").then(
    async (response) => {
      if (response.ok) return response.json();
      else {
        throw new Error(`Unable to get gas price - ${response.statusText}`);
      }
    }
  );
  const gasPrice = await ethers.getDefaultProvider().getGasPrice();
  const gasPriceAsGwei = Number(utils.formatUnits(gasPrice, "gwei"));
  // the return value will be used in BigNumber operations subsequently
  // but BigNumbers can only have integer values, hence rounding off here
  // https://github.com/ethers-io/ethers.js/issues/488
  const convertGasApiToGwei = (value: number): number => Math.round(value / 10);
  const convertGasApiToWei = (value: number): BigNumber => utils.parseUnits(Math.round(value / 10).toString(), "gwei");
  const formatGwei = (value: BigNumber): string => utils.formatUnits(value, "gwei");

  console.log(red("\n\n/!\\ Welcome to the dry run mode. Please read the information below to understand the table"));
  console.log(
    `\nThe table below display information about the cost of the transaction on the mainnet network, depending on the gas price selected. Multiple modes are displayed to help you better help you to choose a gas price depending on your needs:
- ${highlight("current")} mode display information depending on the current information provided to the cli.
- ${highlight("fastest")} mode display information in order to run a transaction in less than 30s.
- ${highlight("fast")} mode display information in order to run a transaction in less than 2 mins.
- ${highlight("average")} mode display information in order to run a transaction in less than 5 mins.
- ${highlight("safe")} mode display information in order to run a transaction in less than 30 mins.
    
For each mode the following information will be shown:
- ${highlight("gas price (gwei)")}: the gas price in gwei used for the transaction.
- ${highlight(
      "tx price (gwei)"
    )}: the price of the transaction in gwei. This is the amount payed for the transaction (outside of dry-run)
- ${highlight(
      "tx price (eth)"
    )}: the price of the transaction in ethereum. This is the amount payed for the transaction (outside of dry-run). You can directly use that amount to convert it to your currency using any currency converter supporting ethereum.
- ${highlight(
      "gas price scale"
    )}: this is an estimation of the value you must set for the '--gas-price-scale' parameter. Keep in mind that two successive runs will likely produce 2 different values as the gas price is fluctuating.

Get more information about gas: https://ethereum.stackexchange.com/questions/3/what-is-meant-by-the-term-gas\n\n`
  );

  console.log(green("Information about the transaction:"));
  console.log(
    `Estimated gas required: ${_estimatedGas.toNumber()} gas, which will cost approximately ${highlight(
      utils.formatEther(_estimatedGas.mul(gasPrice))
    )} eth based on the selected gas price`
  );
  const scaledGasPrice = utils.parseUnits(Math.round(gasPriceAsGwei * gasPriceScale).toString(), "gwei");
  console.table({
    current: {
      time: "N/A",
      "gas price (gwei)": Number(formatGwei(scaledGasPrice)),
      "tx price (gwei)": formatGwei(_estimatedGas.mul(scaledGasPrice)),
      "tx price (eth)": utils.formatEther(_estimatedGas.mul(scaledGasPrice)),
      "gas price scale": Number(gasPriceScale),
    },
    fastest: {
      time: "< 30 s",
      "gas price (gwei)": convertGasApiToGwei(fastest),
      "tx price (gwei)": formatGwei(_estimatedGas.mul(convertGasApiToWei(fastest))),
      "tx price (eth)": utils.formatEther(_estimatedGas.mul(convertGasApiToWei(fastest))),
      "gas price scale": Number((convertGasApiToGwei(fastest) / gasPriceAsGwei).toFixed(2)),
    },
    fast: {
      time: "< 2 mins",
      "gas price (gwei)": convertGasApiToGwei(fast),
      "tx price (gwei)": formatGwei(_estimatedGas.mul(convertGasApiToWei(fast))),
      "tx price (eth)": utils.formatEther(_estimatedGas.mul(convertGasApiToWei(fast))),
      "gas price scale": Number((convertGasApiToGwei(fast) / gasPriceAsGwei).toFixed(2)),
    },
    average: {
      time: "< 5 mins",
      "gas price (gwei)": convertGasApiToGwei(average),
      "tx price (gwei)": formatGwei(_estimatedGas.mul(convertGasApiToWei(average))),
      "tx price (eth)": utils.formatEther(_estimatedGas.mul(convertGasApiToWei(average))),
      "gas price scale": Number((convertGasApiToGwei(average) / gasPriceAsGwei).toFixed(2)),
    },
    safe: {
      time: "< 30 mins",
      "gas price (gwei)": convertGasApiToGwei(safeLow),
      "tx price (gwei)": formatGwei(_estimatedGas.mul(convertGasApiToWei(safeLow))),
      "tx price (eth)": utils.formatEther(_estimatedGas.mul(convertGasApiToWei(safeLow))),
      "gas price scale": Number((convertGasApiToGwei(safeLow) / gasPriceAsGwei).toFixed(2)),
    },
  });
  console.log(red("Please read the information above to understand the table"));
};
