import axios, { AxiosResponse } from "axios";
import { NetworkObject } from "../../../types";

interface ExplorerHeaders {
  module: string;
  action: string;
  address: string;
  startblock: string;
  endblock: string;
  page: string;
  offset: string;
  sort: string;
  apikey: string;
}

interface NetworkAPIDetails {
  apiKey: string;
  hostname: string;
}

const explorerAPIKey = {
  ETH: "",
  MATIC: "",
};

const getHeaders = (contractAddress: string, apiKey: string): ExplorerHeaders => {
  const headers = {
    module: "account",
    action: "txlist",
    startblock: "0",
    endblock: "99999999",
    page: "1",
    offset: "1",
    sort: "asc",
  } as ExplorerHeaders;

  if (apiKey) {
    headers["apikey"] = apiKey;
  }

  if (contractAddress) {
    headers["address"] = contractAddress;
  }

  return headers;
};

const getNetworkAPIDetails = (network: NetworkObject): NetworkAPIDetails => {
  const chain: string = network.network.chain;
  const chainId: number = parseInt(network.network.chainId);
  let url = "";
  let apiKey = "";
  if ("ETH" == chain) {
    let hostnameNetwork = "";
    if (chainId == 1) {
      hostnameNetwork = "";
    } else if (chainId == 3) {
      hostnameNetwork = "-ropsten";
    } else if (chainId == 4) {
      hostnameNetwork = "-rinkeby";
    } else if (chainId == 5) {
      hostnameNetwork = "-goerli";
    } else if (chainId == 42) {
      hostnameNetwork = "-kovan";
    }
    url = `https://api${hostnameNetwork}.etherscan.io/`;
  } else if ("MATIC" == chain) {
    let hostnameNetwork = "";
    if (chainId == 137) {
      hostnameNetwork = "";
    } else if (chainId == 80001) {
      hostnameNetwork = "-testnet";
    }
    url = `https://api${hostnameNetwork}.polygonscan.com/`;
  }
  apiKey = (explorerAPIKey as any)[chain];
  return { hostname: url, apiKey: apiKey } as NetworkAPIDetails;
};

export const sendCreationAddressRequest = async (
  contractAddress: string,
  network: NetworkObject,
  apiKey?: string
): Promise<AxiosResponse> => {
  const networkAPIDetails = getNetworkAPIDetails(network);
  const url = `${networkAPIDetails.hostname}/api`;

  if (apiKey == undefined) {
    apiKey = networkAPIDetails.apiKey;
  }

  return axios({
    method: "get",
    url: url,
    headers: getHeaders(contractAddress, apiKey),
  });
};

// const responseHandler = (response: AxiosResponse): boolean => {
//     // {"status":"0","message":"NOTOK","result":"Max rate limit reached, please use API Key for higher rate limit"}
//     // {"status":"1","message":"OK-Missing/Invalid API Key, rate limit of 1/5sec applied"
//     // {"status":"0","message":"No transactions found","result":[]}
//     if(response.data == undefined){
//         throw new Error("Call has Failed");
//     }else{
//         if(response.data.status.toString() == "0"){
//             if(response.data.message.toString() == "No transactions found"){
//                 return false;
//             }else if(response.data.message.toString() == "NOTOK"){
//                 if(response.data.result.toString() == "Max rate limit reached, please use API Key for higher rate limit"){
//                     return true;
//                 }
//             }
//         }else if(response.data.status.toString() == "1"){
//             return false;
//         }
//     }
//     return false;
// }

export const getCreationAddress = async (
  contractAddress: string,
  network: NetworkObject,
  apiKey?: string
): Promise<string> => {
  const response = await sendCreationAddressRequest(contractAddress, network, apiKey);
  return response.data?.result[0]?.from as string;
};
