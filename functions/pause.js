import nearAPI from "near-api-js";
import { ethers } from "ethers";
import {
  RPC_URL_BY_CHAIN_ID,
  keyStore,
  MAINNET,
  NEAR_CHAINS,
  NEAR_KEYPAIR,
  NEAR_NETWORK,
  NEAR_MAINNET_CONFIG,
  NEAR_TESTNET_CONFIG,
  NEAR_SIGNER_ACCOUNT,
  NEAR_CONTROLLER_CONTRACT,
  NEAR_DEFAULT_PAUSE_METHOD,
  ETHEREUM_PK,
  ETHEREUM_NETWORK,
} from "./config.js";
import pausableAbi from "./Pausable.abi.js";

/**
 * @param {{ body: { networkId: string; chainId: string | number; accountId: string } }} req
 */
export default async function pause(req, res) {
  if (req.method !== "POST") {
    res.set("Allow", "POST");
    res.sendStatus(405);
    return;
  }

  const { networkId, chainId, accountId } = req.body;
  const network = parseInt(chainId);
  const isNearChain = NEAR_CHAINS.includes(chainId);
  const isEvmChain = network > 0;
  if (!networkId || !chainId || !accountId || !(isNearChain || isEvmChain)) {
    res.sendStatus(400);
    return;
  }

  if (networkId === NEAR_NETWORK) {
    await keyStore.setKey(chainId, NEAR_SIGNER_ACCOUNT, NEAR_KEYPAIR);

    const nearConnection = await nearAPI.connect(
      chainId === MAINNET ? NEAR_MAINNET_CONFIG : NEAR_TESTNET_CONFIG,
    );

    const account = await nearConnection.account(NEAR_SIGNER_ACCOUNT);
    const contract = new nearAPI.Contract(account, NEAR_CONTROLLER_CONTRACT, {
      changeMethods: ["delegate_pause"],
    });

    try {
      await contract.delegate_pause({
        args: {
          receiver_id: accountId,
          pause_method_name: req.body.methodName || NEAR_DEFAULT_PAUSE_METHOD,
        },
      });
    } catch (e) {
      console.error(e);
      res.status(401).send(e.type);
      return;
    }
  }

  if (networkId === ETHEREUM_NETWORK) {
    const rpcUrl = RPC_URL_BY_CHAIN_ID[chainId];

    const provider = new ethers.JsonRpcProvider(rpcUrl, network);
    const wallet = new ethers.Wallet(ETHEREUM_PK, provider);

    const contract = new ethers.Contract(accountId, pausableAbi, wallet);
    try {
      await contract.pause();
    } catch (e) {
      console.error(e);
      res.status(401).send(e.reason);
      return;
    }
  }

  res.send("OK");
  return;
}
