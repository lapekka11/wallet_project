import {ethers} from 'ethers'
import {decryptData} from '../../storage_logic/EncryptionUtils';

let from; 
let to;
let wallets;

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
    
    wallets = await window.db.getAllWallets();
    renderWallets(fromSelector, selectedBalance, availableBalance, remainingBalance, amount);

    toAdress.addEventListener('input', async(e) => {
        to = toAdress.value;
    });

    sendBtn.addEventListener('click' , async(e) => {
            e.preventDefault();
            console.log('Send button clicked');

        const amountValue = parseFloat(amount.value);
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
            const tx = await sendTransaction(from, to, amount);
            const save = window.db.saveTransaction(tx);
            console.log(tx); 
            alert('Transaction sent successfully!');
         } catch(err) {
            console.error('Transaction failed:', err);
            alert('Transaction failed: ' + err.message);
         }
        }
       
    });



}

 const objToUint8Array = (obj) => {
            if (!obj) return new Uint8Array();
            if (obj instanceof Uint8Array) return obj;
            if (Array.isArray(obj)) return new Uint8Array(obj);
            return new Uint8Array(Object.values(obj));
        };

async function sendTransaction(from, to, amountElement) {
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
        
        // Decrypt the private key using the password
        const privateKey = await decryptData(encryptedData, password);
        console.log("privateKEy decrypted");
        
        // Create wallet from decrypted private key
        const wallet = new ethers.Wallet(privateKey, window.provider);
        console.log("wallet created tho");
        // Send transaction
        const tx = await wallet.sendTransaction({
            to: to,
            value: ethers.parseEther(amountElement.value)
        });
        
        console.log('Transaction sent:', tx.hash);
        return tx.hash;
        
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
    availableBalance.textContent = ethers.formatEther(await window.provider.getBalance(from.address));
    selectedBalance.textContent = availableBalance.textContent;
    const x = parseFloat(availableBalance.textContent) - parseFloat(amount.value); 
    remainingBalance.textContent = (x >= 0 ? x : 0.0) + ' ETH';
  });
}