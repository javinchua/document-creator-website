import path from "path";
import { handler as createTemporaryDns } from "./createHandler";
import { CreateConfigCommand } from "./config.type";
import { Dns } from "./helpers";
import {
  getConfigWithUpdatedWallet,
  getConfigWithUpdatedForms,
  getConfigFile,
  validate,
  getTokenRegistryAddress,
  getDocumentStoreAddress,
} from "./helpers";
import { utils, v2, v3 } from "@govtechsg/open-attestation";

const SANDBOX_ENDPOINT_URL = "https://sandbox.fyntech.io";
// const walletStr = await readFile(encryptedWalletPath);

// export const readFile = (filename: string): any => {
//   return fs.readFileSync(filename, "utf8");
// };

export const create = async (
  { encryptedWalletPath, outputDir, configTemplatePath, configTemplateUrl }: CreateConfigCommand,
  password: string
): Promise<string> => {
  function downloadObjectAsJson(exportObj: any, exportName: string) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  const walletStr = JSON.stringify(encryptedWalletPath);
  const { address } = JSON.parse(walletStr);
  console.log(`Wallet detected at ${encryptedWalletPath}`);

  const configFile = await getConfigFile(configTemplatePath, configTemplateUrl);
  const { forms } = configFile;

  if (!validate(forms)) {
    throw new Error("Invalid form detected in config file, please update the form before proceeding.");
  }

  const hasTransferableRecord = forms.some((form) => form.type === "TRANSFERABLE_RECORD");
  const hasDocumentStore = forms.some((form) => form.type === "VERIFIABLE_DOCUMENT");
  const hasDid = forms.some((form) => {
    //check form for v2/v3
    const didCheckList = ["DID", "DNS-DID"];
    if (utils.isRawV3Document(form.defaults)) {
      const v3Defaults = form.defaults as v3.OpenAttestationDocument;
      return didCheckList.includes(v3Defaults.openAttestationMetadata.proof.method);
    } else {
      const v2Defaults = form.defaults as v2.OpenAttestationDocument;
      return v2Defaults.issuers.some((issuer) => {
        const identityProof = issuer.identityProof;
        if (!identityProof) return false;
        return didCheckList.includes(identityProof.type);
      });
    }
  });

  let tokenRegistryAddress = "";
  let documentStoreAddress = "";
  let dnsTransferableRecord: Dns = "";
  let dnsVerifiable: Dns = "";
  let dnsDid: Dns = "";

  if (hasTransferableRecord) {
    tokenRegistryAddress = await getTokenRegistryAddress(encryptedWalletPath, password);
    dnsTransferableRecord = await createTemporaryDns({
      networkId: 3,
      address: tokenRegistryAddress,
      sandboxEndpoint: SANDBOX_ENDPOINT_URL,
    });
  }

  if (hasDocumentStore) {
    documentStoreAddress = await getDocumentStoreAddress(encryptedWalletPath, password);
    dnsVerifiable = await createTemporaryDns({
      networkId: 3,
      address: documentStoreAddress,
      sandboxEndpoint: SANDBOX_ENDPOINT_URL,
    });
  }

  if (hasDid) {
    // DID no need deploy any
    dnsDid = await createTemporaryDns({
      networkId: 3,
      publicKey: `did:ethr:0x${address}#controller`,
      sandboxEndpoint: SANDBOX_ENDPOINT_URL,
    });
  }

  const updatedConfigFileWithWallet = getConfigWithUpdatedWallet({ configFile, walletStr });
  const updatedConfigFileWithForms = getConfigWithUpdatedForms({
    configFile: updatedConfigFileWithWallet,
    documentStoreAddress,
    tokenRegistryAddress,
    dnsVerifiable,
    dnsDid,
    dnsTransferableRecord,
  });

  const outputPath = path.join(outputDir, "config.json");
  // fs.writeFileSync(outputPath, JSON.stringify(updatedConfigFileWithForms, null, 2));
  downloadObjectAsJson(JSON.stringify(updatedConfigFileWithForms, null, 2), "config");
  return outputPath;
};
