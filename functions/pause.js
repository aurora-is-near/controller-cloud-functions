import nearAPI, { KeyPair } from "near-api-js";
import { parseSeedPhrase } from "near-seed-phrase";
import { ethers } from "ethers";
import base58 from "bs58";
import {
  RPC_URL_BY_CHAIN_ID,
  keyStore,
  MAINNET,
  NEAR_CHAINS,
  NEAR_NETWORK,
  NEAR_MAINNET_CONFIG,
  NEAR_TESTNET_CONFIG,
  NEAR_INDEX_BY_CHAIN_ID,
  NEAR_DERIVATION_PATH,
  NEAR_MNEMONIC,
  NEAR_CONTROLLER_CONTRACT,
  NEAR_DEFAULT_PAUSE_METHOD,
  ETH_INDEX_BY_CHAIN_ID,
  ETHEREUM_DERIVATION_PATH,
  ETHEREUM_MNEMONIC,
  ETHEREUM_NETWORK,
} from "./config.js";
import pausableAbi from "./Pausable.abi.js";

/**
 * @param {{ body: { networkId: string; chainId: string | number; accountId: string; sender: string | undefined } }} req
 */
export default async function pause(req, res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.set("Allow", "POST");
    res.sendStatus(405);
    return;
  }

  const { networkId, chainId, accountId, sender } = req.body;
  const network = parseInt(chainId);
  const isNearChain =
    networkId === NEAR_NETWORK && NEAR_CHAINS.includes(chainId);
  const isEvmChain = networkId === ETHEREUM_NETWORK && network > 0;
  if (!networkId || !chainId || !accountId || !(isNearChain || isEvmChain)) {
    res.sendStatus(400);
    return;
  }

  if (isNearChain) {
    // `'` character at the end is required
    const derivationPath = `${NEAR_DERIVATION_PATH}/${NEAR_INDEX_BY_CHAIN_ID[chainId]}'`;
    console.log(`Deriving public key from ${derivationPath}`);

    const { publicKey, secretKey } = parseSeedPhrase(
      NEAR_MNEMONIC,
      derivationPath,
    );
    const keypair = KeyPair.fromString(secretKey);
    console.log(`Public Key: ${publicKey}`);

    const [, pk] = publicKey.split(":");
    const implicitAccountId = Buffer.from(base58.decode(pk)).toString("hex");
    const signer = sender || implicitAccountId;
    console.info(`Signer: ${signer}`);

    await keyStore.setKey(chainId, signer, keypair);

    const nearConnection = await nearAPI.connect(
      chainId === MAINNET ? NEAR_MAINNET_CONFIG : NEAR_TESTNET_CONFIG,
    );

    const account = await nearConnection.account(signer);
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

  if (isEvmChain) {
    const rpcUrl = RPC_URL_BY_CHAIN_ID[chainId];
    const provider = new ethers.JsonRpcProvider(rpcUrl, network);

    const derivationPath = `${ETHEREUM_DERIVATION_PATH}/${ETH_INDEX_BY_CHAIN_ID[chainId]}`;
    console.log(`Deriving public key from ${derivationPath}`);

    const wallet = ethers.HDNodeWallet.fromMnemonic(
      ethers.Mnemonic.fromPhrase(ETHEREUM_MNEMONIC),
      derivationPath,
    ).connect(provider);
    console.info(`Signer: ${wallet.publicKey}`);

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
