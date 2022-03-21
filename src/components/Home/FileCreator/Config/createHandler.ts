import { Argv } from "yargs";
import fetch, { RequestInit } from "node-fetch";
import chalk from "chalk";

export interface DnsCreateTxtRecordCommand {
  address?: string;
  networkId?: number;
  publicKey?: string;
  sandboxEndpoint: string;
}
export interface DnsGetTxtRecordCommand {
  location: string;
  networkId?: number;
}

type ErrorWithMessage = {
  message: string;
};

// eslint-disable-next-line @typescript-eslint/no-shadow
const isErrorWithMessage = (error: unknown): error is ErrorWithMessage =>
  typeof error === "object" &&
  error !== null &&
  "message" in error &&
  typeof (error as Record<string, unknown>).message === "string";

const toErrorWithMessage = function (maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
};

// eslint-disable-next-line @typescript-eslint/no-shadow
export const extractErrorMessage = (error: unknown): string => toErrorWithMessage(error).message;

// eslint-disable-next-line @typescript-eslint/no-shadow
export const getErrorMessage = function (error: unknown): string {
  if (error instanceof Error) {
    return "reason" in error ? error["reason"] : error.message;
  } else {
    return extractErrorMessage(error);
  }
};

const orange = chalk.hsl(39, 100, 50);
export const highlight = orange.bold;

export const command = "create [options]";

export const describe = "Creates an Issuer's DNS entry in OpenAttestation's sandbox environment for tutorial purposes";

export const builder = (yargs: Argv): Argv =>
  yargs
    .option("address", {
      alias: "a",
      description: "Contract address of the Document Store or Token Registry",
      type: "string",
      demandOption: false,
      conflicts: "publicKey",
    })
    .option("networkId", {
      description: "Ethereum network (chain ID) that this record is for",
      type: "number",
      demandOption: false,
      conflicts: "publicKey",
    })
    .option("public-key", {
      description: "Did that this record is for",
      type: "string",
      demandOption: false,
      conflicts: ["networkId", "address"],
    })
    .option("sandbox-endpoint", {
      description: "Sandbox address to create record at",
      default: "https://sandbox.openattestation.com",
      alias: "t",
      demandOption: false,
      type: "string",
    });

export const request = (url: string, options?: RequestInit): Promise<any> => {
  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`unexpected response ${response.statusText}`);
      }
      return response;
    })
    .then((response) => response.json());
};
export const handler = async (args: DnsCreateTxtRecordCommand): Promise<string | undefined> => {
  console.log(`Args: ${JSON.stringify(args, null, 2)}`);
  if (!args.publicKey && !(args.address && args.networkId)) {
    console.log("You need to provided a public key or an address with a networkId");
    return;
  }
  const baseUrl = args.sandboxEndpoint;
  try {
    const { executionId } = await request(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...(args.publicKey ? { algorithm: "dns-did", publicKey: args.publicKey } : args) }),
    });
    const { name, expiryDate } = await request(`${baseUrl}/execution/${executionId}`);
    console.log(
      `Record created at ${highlight(name)} and will stay valid until ${highlight(new Date(expiryDate).toString())}`
    );
    return name;
  } catch (e) {
    console.log(getErrorMessage(e));
  }
};
