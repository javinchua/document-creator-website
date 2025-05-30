export interface ChainInfoObject {
  label: string;
  chain: string;
  chainId: ChainId;
  networkName: string; // network name that aligns with existing NETWORK_NAME
  explorerUrl: string;
}

type ChainInfo = Record<ChainId, ChainInfoObject>;

export enum ChainId {
  // Localhost
  Local = 1337,

  // Ethereum Mainnet
  Ethereum = 1,

  // Ethereum Testnet
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,

  // Polygon
  Polygon = 137,
  PolygonMumbai = 80001,
}

export const ChainInfo: ChainInfo = {
  [ChainId.Local]: {
    label: "Local",
    chain: "ETH",
    chainId: ChainId.Local,
    networkName: "local",
    explorerUrl: "https://localhost/explorer",
  },
  [ChainId.Ethereum]: {
    label: "Ethereum",
    chain: "ETH",
    chainId: ChainId.Ethereum,
    networkName: "homestead",
    explorerUrl: "https://etherscan.io",
  },
  [ChainId.Ropsten]: {
    label: "Ropsten",
    chain: "ETH",
    chainId: ChainId.Ropsten,
    networkName: "ropsten",
    explorerUrl: "https://ropsten.etherscan.io",
  },
  [ChainId.Rinkeby]: {
    label: "Rinkeby",
    chain: "ETH",
    chainId: ChainId.Rinkeby,
    networkName: "rinkeby",
    explorerUrl: "https://rinkeby.etherscan.io",
  },
  [ChainId.Goerli]: {
    label: "Goerli",
    chain: "ETH",
    chainId: ChainId.Goerli,
    networkName: "goerli",
    explorerUrl: "https://goerli.etherscan.io",
  },
  [ChainId.Kovan]: {
    label: "Kovan",
    chain: "ETH",
    chainId: ChainId.Kovan,
    networkName: "kovan",
    explorerUrl: "https://kovan.etherscan.io",
  },
  [ChainId.Polygon]: {
    label: "Polygon (Beta)",
    chain: "MATIC",
    chainId: ChainId.Polygon,
    networkName: "matic",
    explorerUrl: "https://polygonscan.com",
  },
  [ChainId.PolygonMumbai]: {
    label: "Polygon Mumbai",
    chain: "MATIC",
    chainId: ChainId.PolygonMumbai,
    networkName: "maticmum",
    explorerUrl: "https://mumbai.polygonscan.com",
  },
};
