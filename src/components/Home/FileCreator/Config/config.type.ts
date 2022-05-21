import { Signer } from "ethers";

export interface CreateConfigCommand {
  outputDir: string;
  encryptedWalletPath: any;
  configTemplatePath: string;
  signer?: Signer;
}
