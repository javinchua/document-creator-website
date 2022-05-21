import { Signer } from "ethers";

export interface NetworkOption {
  network: string;
}
export type WalletOption = {
  encryptedWalletPath: string;
};
// it should be a union, because we expect one or the other key. However I couldn't find a clean way to handle this, with the rest of the code
export type PrivateKeyOption =
  | {
      key?: string;
      keyFile?: never;
    }
  | {
      key?: never;
      keyFile?: string;
    };

export type InjectedOption = {
  injected: Signer;
};

export type NetworkAndWalletSignerOption = NetworkOption &
  (Partial<WalletOption> | Partial<PrivateKeyOption> | Partial<InjectedOption>);

export interface GasOption {
  gasPriceScale: number;
  dryRun: boolean;
}
export type DeployDocumentStoreCommand = NetworkAndWalletSignerOption &
  GasOption & {
    storeName: string;
  };

export type DeployTokenRegistryCommand = NetworkAndWalletSignerOption &
  GasOption & {
    registryName: string;
    registrySymbol: string;
  };
