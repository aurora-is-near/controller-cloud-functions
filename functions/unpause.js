import { ethers } from "ethers";
import {
  RPC_URL_BY_CHAIN_ID,
  ETHEREUM_PK,
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
  if (!networkId || !chainId || !accountId) {
    res.sendStatus(400);
    return;
  }

  const network = Number(chainId);
  if (networkId === ETHEREUM_NETWORK && network > 0) {
    const rpcUrl = RPC_URL_BY_CHAIN_ID[chainId];

    const provider = new ethers.JsonRpcProvider(rpcUrl, network);
    const wallet = new ethers.Wallet(ETHEREUM_PK, provider);

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
