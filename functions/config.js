import { KeyPair, keyStores } from "near-api-js";

export const RPC_URL_BY_CHAIN_ID = {
  1: "https://eth.llamarpc.com",
  1313161554: "https://mainnet.aurora.dev	",
};

const NEAR_PK =
  process.env.NEAR_PRIVATE_KEY ||
  "by8kdJoJHu7uUkKfoaLd2J2Dp1q1TigeWMG123pHdu9UREqPcshCM223kWadm";
export const NEAR_KEYPAIR = KeyPair.fromString(NEAR_PK);

export const keyStore = new keyStores.InMemoryKeyStore();
export const NEAR_MAINNET_CONFIG = {
  networkId: "mainnet",
  keyStore,
  nodeUrl: "https://rpc.mainnet.near.org",
  walletUrl: "https://wallet.mainnet.near.org",
  helperUrl: "https://helper.mainnet.near.org",
  explorerUrl: "https://nearblocks.io",
};
export const NEAR_TESTNET_CONFIG = {
  networkId: "testnet",
  keyStore,
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://testnet.mynearwallet.com/",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://testnet.nearblocks.io",
};

export const MAINNET = "mainnet";
export const TESTNET = "testnet";
export const NEAR_CHAINS = [MAINNET, TESTNET];
export const NEAR_NETWORK = "near";
// todo: replace with real controller address
export const NEAR_SIGNER_ACCOUNT = "controller-account.near";
// todo: should this be user defined too or will this be a singleton?
export const NEAR_CONTROLLER_CONTRACT = "controller-contract.near";
// todo: confirm this is the correct default, e.g. engine uses "pause_contract"
export const NEAR_DEFAULT_PAUSE_METHOD = "pa_pause_feature";

export const ETHEREUM_NETWORK = "ethereum";
export const ETHEREUM_PK =
  process.env.ETH_PRIVATE_KEY ||
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
