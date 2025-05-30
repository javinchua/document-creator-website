import { utils, v2, v3 } from "@govtechsg/open-attestation";
import fetch from "node-fetch";
import fs from "fs";
import { deployDocumentStore } from "./document-store";
import { deployTokenRegistry } from "./token-registry";
import chalk from "chalk";
import { OpenAttestationDocument } from "@govtechsg/open-attestation";
import { Signer } from "ethers";
export const readFile = (filename: string): any => {
  return fs.readFileSync(filename, "utf8");
};
type WalletEncryptedJson = {
  type: "ENCRYPTED_JSON";
  encryptedJson: string;
};

export type Dns = string | undefined;

export type Form = {
  name: string;
  type: "VERIFIABLE_DOCUMENT" | "TRANSFERABLE_RECORD";
  defaults: OpenAttestationDocument;
  schema: any;
  uiSchema?: any;
  attachments?: {
    allow: boolean;
    accept: string;
  };
  extension?: string;
  fileName?: string;
};

export interface ConfigFile {
  network: "ropsten" | "rinkeby" | "homestead" | "local";
  wallet: WalletEncryptedJson;
  forms: Form[];
  documentStorage?: {
    apiKey?: string;
    url: string;
  };
}
const orange = chalk.hsl(39, 100, 50);
export const highlight = orange.bold;
interface UpdatedWallet {
  configFile: ConfigFile;
  walletStr: string;
}

export const getConfigWithUpdatedWallet = ({ configFile, walletStr }: UpdatedWallet): ConfigFile => {
  return {
    ...configFile,
    wallet: { ...configFile.wallet, encryptedJson: walletStr },
  };
};

interface UpdatedForms {
  configFile: ConfigFile;
  documentStoreAddress: string;
  tokenRegistryAddress: string;
  dnsVerifiable: Dns;
  dnsDid: Dns;
  dnsTransferableRecord: Dns;
}

export const getConfigWithUpdatedForms = ({
  configFile,
  documentStoreAddress,
  tokenRegistryAddress,
  dnsVerifiable,
  dnsDid,
  dnsTransferableRecord,
}: UpdatedForms): ConfigFile => {
  const { wallet, forms } = configFile;

  const updatedForms = forms.map((form: Form) => {
    if (utils.isRawV3Document(form.defaults)) {
      utils.updateFormV3({
        wallet,
        form,
        documentStoreAddress,
        tokenRegistryAddress,
        dnsVerifiable: dnsVerifiable || "",
        dnsDid: dnsDid || "",
        dnsTransferableRecord: dnsTransferableRecord || "",
      });
    } else {
      utils.updateFormV2({
        wallet,
        form,
        documentStoreAddress,
        tokenRegistryAddress,
        dnsVerifiable: dnsVerifiable || "",
        dnsDid: dnsDid || "",
        dnsTransferableRecord: dnsTransferableRecord || "",
      });
    }

    return form;
  });

  return {
    ...configFile,
    forms: updatedForms,
  };
};

export const getConfigFile = async (configTemplatePath: string, configTemplateUrl: string): Promise<ConfigFile> => {
  if (configTemplatePath) {
    return JSON.parse(await readFile(configTemplatePath));
  }

  if (configTemplateUrl) {
    const url = new URL(configTemplateUrl);
    const response = await fetch(url);
    const json = await response.json();
    return json;
  }

  throw new Error("Config template reference not provided.");
};

export const getTokenRegistryAddress = async (
  encryptedWalletPath?: string,
  password?: string,
  injected?: Signer
): Promise<string> => {
  let tokenRegistry;
  if (injected) {
    tokenRegistry = await deployTokenRegistry({
      injected,
      network: "maticmum",
      gasPriceScale: 1,
      dryRun: false,
      registryName: "Token Registry",
      registrySymbol: "TR",
    });
  } else {
    tokenRegistry = await deployTokenRegistry(
      {
        encryptedWalletPath,
        network: "maticmum",
        gasPriceScale: 1,
        dryRun: false,
        registryName: "Token Registry",
        registrySymbol: "TR",
      },
      password
    );
  }
  const { contractAddress } = tokenRegistry;
  console.log(`Token registry deployed, address: ${highlight(contractAddress)}`);
  return contractAddress;
};

export const getDocumentStoreAddress = async (encryptedWalletPath: string, password: string): Promise<string> => {
  const documentStore = await deployDocumentStore(
    {
      encryptedWalletPath,
      network: "ropsten",
      gasPriceScale: 1,
      dryRun: false,
      storeName: "Document Store",
    },
    password
  );
  const { contractAddress } = documentStore;
  console.log(`Document store deployed, address: ${highlight(contractAddress)}`);
  return contractAddress;
};

export const validate = (forms: Form[]): boolean => {
  const isValidForm = forms.map((form: Form) => {
    const formTypeCheckList = ["TRANSFERABLE_RECORD", "VERIFIABLE_DOCUMENT"];
    const isValidFormType = formTypeCheckList.includes(form.type);
    let isValidIdentityProofType: boolean;
    const identityProofTypeCheckList = ["DNS-TXT", "DNS-DID", "DID"];
    // test for v2/v3 form defaults
    if (utils.isRawV3Document(form.defaults)) {
      const v3Defaults = form.defaults as v3.OpenAttestationDocument;
      isValidIdentityProofType = identityProofTypeCheckList.includes(
        v3Defaults.openAttestationMetadata.identityProof.type
      );
    } else {
      const v2Defaults = form.defaults as v2.OpenAttestationDocument;
      isValidIdentityProofType = v2Defaults.issuers.some((issuer) => {
        const identityProofType = issuer.identityProof?.type;
        if (identityProofType) {
          return identityProofTypeCheckList.includes(identityProofType);
        }
        return false;
      });
    }
    return isValidFormType && isValidIdentityProofType;
  });
  const anyInvalidForm = !isValidForm.some((validForm: boolean) => validForm === false);
  return anyInvalidForm;
};
