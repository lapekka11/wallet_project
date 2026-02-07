import { ethers } from "ethers";
import { saveTransaction } from "./StorageUtile.js";

let provider;

export function initProvider(rpcUrl) {
  provider = new ethers.JsonRpcProvider(rpcUrl);
}

export async function getBalance(address) {
  return ethers.formatEther(await provider.getBalance(address));
}

export async function getTransactionsByAdress(address, limit = 50) {
  const history = await provider.getHistory(address);
  return history.slice(-limit).reverse();
}

export async function sendTransaction(signer, tx,amount) {
  const response = await signer.sendTransaction(tx);
  const receipt = await response.wait();

  if (receipt.status !== 1) throw new Error("Transaction failed");

  await saveTransaction(
    receipt.transactionHash,
     receipt.from,
    receipt.to,
    amount,
     receipt.blockNumber
  );

  return receipt;
}
