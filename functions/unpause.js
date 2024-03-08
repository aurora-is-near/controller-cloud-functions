import { ethers } from "ethers";
import {
  RPC_URL_BY_CHAIN_ID,
  ETH_INDEX_BY_CHAIN_ID,
  ETHEREUM_DERIVATION_PATH,
  ETHEREUM_MNEMONIC,
  ETHEREUM_NETWORK,
} from "./config.js";
import pausableAbi from "./Pausable.abi.js";

/**
 * @param {{ body: { networkId: string; chainId: string | number; accountId: string } }} req
 */
export default async function unpause(req, res) {
  if (req.method !== "POST") {
    res.set("Allow", "POST");
    res.sendStatus(405);
    return;
  }

  const { networkId, chainId, accountId } = req.body;
  const network = Number(chainId);
  const isEvmChain = networkId === ETHEREUM_NETWORK && network > 0;
  if (!networkId || !chainId || !accountId || !isEvmChain) {
    res.sendStatus(400);
    return;
  }

  if (isEvmChain) {
    const rpcUrl = RPC_URL_BY_CHAIN_ID[chainId];

    const provider = new ethers.JsonRpcProvider(rpcUrl, network);
    const derivationPath = `${ETHEREUM_DERIVATION_PATH}/${ETH_INDEX_BY_CHAIN_ID[chainId]}`;
    console.log(`Deriving public key from ${derivationPath}`);

    const wallet = ethers.HDNodeWallet.fromMnemonic(
      ETHEREUM_MNEMONIC,
      derivationPath,
    ).connect(provider);
    console.info(`Signer: ${wallet.publicKey}`);

    const contract = new ethers.Contract(accountId, pausableAbi, wallet);
    try {
      await contract.unPause();
    } catch (e) {
      console.error(e);
      res.status(401).send(e.reason);
      return;
    }
  }

  res.send("OK");
  return;
}
