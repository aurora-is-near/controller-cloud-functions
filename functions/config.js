import { keyStores } from "near-api-js";

export const RPC_URL_BY_CHAIN_ID = {
  1: "https://eth.llamarpc.com",
  1313161554: "https://mainnet.aurora.dev",
};
export const ETH_INDEX_BY_CHAIN_ID = {
  1: "0/0",
  1313161554: "0/1",
};

export const ETHEREUM_NETWORK = "ethereum";
export const ETHEREUM_DERIVATION_PATH = "m/44'/60'/0'";
export const ETHEREUM_MNEMONIC =
  process.env.ETH_PRIVATE_KEY ||
  "test test test test test test test test test test test junk";

export const NEAR_NETWORK = "near";
export const NEAR_DERIVATION_PATH = "m/44'/397'";
export const NEAR_MNEMONIC =
  process.env.NEAR_PRIVATE_KEY ||
  "air minute wish amazing detect animal acoustic robot basket web brisk fragile";

export const MAINNET = "mainnet";
export const TESTNET = "testnet";
export const NEAR_CHAINS = [MAINNET, TESTNET];
export const NEAR_INDEX_BY_CHAIN_ID = {
  [MAINNET]: "0",
  [TESTNET]: "1",
};

export const keyStore = new keyStores.InMemoryKeyStore();
export const NEAR_MAINNET_CONFIG = {
  networkId: MAINNET,
  keyStore,
  nodeUrl: "https://rpc.mainnet.near.org",
  walletUrl: "https://wallet.mainnet.near.org",
  helperUrl: "https://helper.mainnet.near.org",
  explorerUrl: "https://nearblocks.io",
};
export const NEAR_TESTNET_CONFIG = {
  networkId: TESTNET,
  keyStore,
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://testnet.mynearwallet.com/",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://testnet.nearblocks.io",
};

// TODO: should this be user defined too or will this be a singleton?
export const NEAR_CONTROLLER_CONTRACT = "controller-ctl.testnet";

// TODO: confirm this is the correct default, e.g. engine uses "pause_contract"
export const NEAR_DEFAULT_PAUSE_METHOD = "pa_pause_feature";
