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

export type EncryptWalletCommand = PrivateKeyOption & {
  outputFile: string;
};

export interface CreateWalletCommand {
  outputFile: string;
  fund?: string;
}

export interface DecryptWalletCommand {
  inputFile: string;
  yes: boolean;
}
