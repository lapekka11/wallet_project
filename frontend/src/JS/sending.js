import {ethers} from 'ethers'
import {decryptData} from '../Workers/EncryptionUtils';
import { getETHPriceFromAPI } from './config';
import {sendToWorker} from '../../main.js';

let from; 
let to;
let wallets;
let amountValue;
let currWalletTransactions;
export async function initSendingPage(){
    const fromSelector = document.getElementById("fromAccount");
    const selectedBalance = document.getElementById("selectedBalance");
    const toAdress = document.getElementById("toAddress");
    const amount = document.getElementById("amount");
    const amountBtn = document.getElementsByClassName("amount-btn");
    const exchangeRate = document.getElementById("exchangeRate");
    const fiatValue = document.getElementById("fiatValue");
    const availableBalance = document.getElementById("availableBalance");
    const remainingBalance = document.getElementById("remainingBalance");
    const sendBtn = document.getElementById("sendBtn");
    const recentRecipient = document.getElementById("recentRecipientsBtn");
    const totalCostText = document.getElementById("totalCost");
    const gasEstimate = document.getElementById("gasEstimate");
    const slowButton = document.getElementById("slowBtn");


    let txSpeed = 1.0;
    let gasLimit = 0.0;
    let maxFeePerGas = 0.0;
    let maxPriorityFeePerGas = 0.0;
    const rate = await getETHPriceFromAPI();
    let prevButton = normalButton;

    exchangeRate.textContent =( "1 ETH = $" + rate);
    
    
    wallets =( await sendToWorker("GET_ALL_WALLETS")).payload;
    
    renderWallets(fromSelector, selectedBalance, availableBalance, remainingBalance, amount);

    toAdress.addEventListener('input', async(e) => {
        to = toAdress.value;
    });

    recentRecipient.addEventListener('click', async(e) => {
        if (!currWalletTransactions || !currWalletTransactions.length) {
    alert("You have to select a wallet to view recent transactions.");
  } else {
    const message = currWalletTransactions
      .map(tx => `From: ${tx.from},\nTo: ${tx.to},\nAmount: ${tx.amount}`)
      .join('\n');

    alert(message);
  }
    });

    

    slowButton.addEventListener('click', async(e) => {
        const amountValue = parseFloat(amount.value);
        txSpeed = 80.0/100.0;
        prevButton.className="gas-btn";
        slowButton.className="gas-btn active";
        prevButton = slowButton;
    alterCurrencyValues(maxFeePerGas,txSpeed,gasLimit,gasEstimate,availableBalance,totalCostText,remainingBalance,fiatValue,amountValue,rate);

    });
    normalButton.addEventListener('click', async(e) => {
        const amountValue = parseFloat(amount.value);
        prevButton.className="gas-btn";
        normalButton.className="gas-btn active";
        prevButton = normalButton;
        txSpeed = 1.0;
            alterCurrencyValues(maxFeePerGas,txSpeed,gasLimit,gasEstimate,availableBalance,totalCostText,remainingBalance,fiatValue,amountValue,rate);

    });
    fastButton.addEventListener('click', async(e) => {
        const amountValue = parseFloat(amount.value);
        prevButton.className="gas-btn";
        fastButton.className="gas-btn active";;
        prevButton = fastButton;
        txSpeed = 120.0/100.0;
            alterCurrencyValues(maxFeePerGas,txSpeed,gasLimit,gasEstimate,availableBalance,totalCostText,remainingBalance,fiatValue,amountValue,rate);

    });

   amount.addEventListener('change', async(e) => {
    const amountValue = parseFloat(amount.value);
    const gasData = (await sendToWorker("ESTIMATE_GAS", {to,amountValue})).payload;
    gasLimit = gasData.gasLimit;
    maxFeePerGas = gasData.maxFeePerGas;
    maxPriorityFeePerGas = gasData.maxPriorityFeePerGas;
    console.log("GASES: " , gasLimit, maxFeePerGas, maxPriorityFeePerGas);
    alterCurrencyValues(maxFeePerGas,txSpeed,gasLimit,gasEstimate,availableBalance,totalCostText,remainingBalance,fiatValue,amountValue,rate);
    
});

    
    sendBtn.addEventListener('click' , async(e) => {
            e.preventDefault();
            console.log('Send button clicked');

         amountValue = parseFloat(amount.value);
        console.log('Amount value:', amountValue, 'From:', from, 'To:', to);
                const availableValue = parseFloat(availableBalance.textContent);

        if(amountValue <= 0.0){
            alert("Amount to send must be greater than 0!");
            return; 
        }
        else if(to === "" || to === undefined){
            alert("Receiving address must not be empty!")
            return;
        }
        
        else if(availableValue - amountValue < 0){
            alert("not enough funds for this transaction!");
            return;
        }
        else{
            try {
            const tx = await sendTransaction(from, to, amount,gasLimit,maxFeePerGas,maxPriorityFeePerGas);
            console.log(tx); 
            alert('Transaction sent successfully!');
         } catch(err) {
            console.error('Transaction failed:', err);
            alert('Transaction failed: ' + err.message);
         }
        }
       
    });


   

    


    document.getElementById("previewBtn").addEventListener("click", () => {
  document.getElementById("inlineFrom").textContent = from.address;
  document.getElementById("inlineTo").textContent = to;
  document.getElementById("inlineAmount").textContent = `${amountValue} ${currency}`;
  document.getElementById("inlineFee").textContent = "feeEstimate";
  document.getElementById("inlineTotal").textContent = "totalCost";

  document.getElementById("inlinePreview").style.display = "flex";
});




 const objToUint8Array = (obj) => {
            if (!obj) return new Uint8Array();
            if (obj instanceof Uint8Array) return obj;
            if (Array.isArray(obj)) return new Uint8Array(obj);
            return new Uint8Array(Object.values(obj));
        };

async function sendTransaction(from, to, amountElement, gasLimit, maxFeePerGas, maxPriorityFeePerGas) {
    try {
        // Ask for password to decrypt
        const password = prompt("Enter your wallet password to sign transaction:");
        if (!password) throw new Error('Password required');
        console.log("from: ",from);
        const walletData = from;
        // Ensure encryptedData has the correct structure
        const encryptedData = {
            ciphertext: objToUint8Array(walletData.ciphertext.ciphertext),
            iv: objToUint8Array(walletData.ciphertext.iv),
            authTag: objToUint8Array(walletData.ciphertext.authTag),
            salt: objToUint8Array(walletData.ciphertext.salt),
        };
        console.log("encryptedData prepared for decryption:", encryptedData);
        const passCheck = await sendToWorker("CHECK_PASS_ADDRESS", {password, address: walletData.address}); 
        if(passCheck.type === "FAIL"){
            alert("Incorrect password!");
            return;
        }
        const value = amountElement.value;
        console.log(value);
        const receipt = await sendToWorker("SEND_TX", {encryptedData, password,to, value,gasLimit,maxFeePerGas,maxPriorityFeePerGas});
        if(receipt.type === "TX_SENT"){
            alert("Successfully sent the transaction!");
        }
        // Decrypt the private key using the password
        
        return receipt.receipt;
        
    } catch (err) {
        console.error('Transaction failed:', err);
        throw err;
    }

}




 function renderWallets(fromSelector, selectedBalance, availableBalance, remainingBalance, amount) {
  fromSelector.innerHTML='<option value="" disabled selected>Select Wallet</option>';
  wallets.forEach(wl => {
    const item = document.createElement('option');
    item.className = 'wallet-item';
    item.textContent = `${wl.name} - ${wl.address}`;
    item.dataset.id = wl.id;
    item.value = JSON.stringify(wl);
    
    fromSelector.appendChild(item);
  });
  
  fromSelector.addEventListener('change', async (e) => {
    from = JSON.parse(e.target.value);
    console.log("changing to " + from);
    availableBalance.textContent = (await sendToWorker("GET_BALANCE_SPEC",from.address)).payload;
    selectedBalance.textContent = availableBalance.textContent;
    console.log(availableBalance.textContent);
    const x = availableBalance.textContent - amount.textContent; 
    console.log(x);
    remainingBalance.textContent = (x >= 0 ? x : 0.0) + ' ETH';
    currWalletTransactions = (await sendToWorker("GET_TXS"));
  });
}

function alterCurrencyValues(maxFeePerGas, txSpeed, gasLimit, gasEstimate,availableBalance,totalCostText,remainingBalance,fiatValue,amountValue,rate){
    console.log("VALUES: ",maxFeePerGas, txSpeed, gasLimit, gasEstimate,availableBalance,totalCostText,remainingBalance,fiatValue,amountValue,rate);
    maxFeePerGas = maxFeePerGas * txSpeed;
    
    const gasCostWei = BigInt(gasLimit) * BigInt(maxFeePerGas);
    const gasCostETH = ethers.formatEther(gasCostWei);
    console.log(gasCostETH);

    gasEstimate.textContent = gasCostETH;
    const availableBalanceNum = parseFloat(availableBalance.textContent);

    const totalCost = amountValue + parseFloat(gasCostETH);
    totalCostText.textContent = (totalCost >= 0 ? totalCost : 0)+ ' ETH' ;

    const remaining = availableBalanceNum - totalCost;    
    remainingBalance.textContent = (remaining >= 0 ? remaining : availableBalanceNum) + ' ETH';
    fiatValue.textContent = "≈ $"+ (amountValue * rate >= 0 ? amountValue*rate : 0) ; 
}}