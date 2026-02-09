import { getETHPriceFromAPI } from './config';
import{sendToWorker} from '../../main.js';


 export let wallet = null;
 export let wallets;


 export async function initDashboard(){

    if(document.cookie.includes("locked=true")) {
        window.router.navigate('/locked');
        return;
    }
    const currentCheck = (await sendToWorker("GET_CURRWALLET")).payload;
    if(!currentCheck){
      alert("No wallets found, please create one to get started!");
      window.router.navigate("/create");
      return;
    }

     const balanceDisplay = document.getElementById('balanceDisplay');
     const fiatValue = document.getElementById('fiatValue');
     const transactionsList = document.getElementById('transactionsList');
     const currentAddress = document.getElementById('currentAddress');
     const disconnectBtn = document.getElementById('disconnectBtn');
     const sendBtn = document.getElementById('sendBtn');
     const provider = window.provider;
     const lockScreen = document.getElementById("lock-overlay");
     const unlock = document.getElementById("unlockWallet");
     const unlockPassword = document.getElementById("unlockPassword");
     


    
    
    
    try {
        wallets = (await sendToWorker("GET_ALL_WALLETS")).payload;
    } catch (err) {
        console.error('Error fetching wallets', err);
        alert('Failed to load wallets. See console for details.');
        window.router.navigate('/create');
        return;
    }
     wallet = (await sendToWorker("GET_CURRWALLET")).payload || null;
     if(!wallet){
         alert('No wallet found. Please create a wallet first.');
         window.router.navigate('/create');
         return;
     }

 
     currentAddress.textContent = `Address: ${wallet.address}`;
     const balance = (await sendToWorker("GET_BALANCE")).payload;
     balanceDisplay.textContent = balance + ' ETH';
     const transactions = (await sendToWorker("GET_TXS")).payload ;
     console.log(transactions);

transactionsList.innerHTML = ''; // clear existing

if (!transactions.length) {
  const empty = document.createElement('div');
  empty.textContent = 'No transactions yet';
  empty.style.color = '#9ca3af';
  empty.style.textAlign = 'center';
  empty.style.padding = '12px';
  transactionsList.appendChild(empty);
} else {
  transactions.forEach(tx => {
    const row = document.createElement('div');
    row.innerHTML = `
      <span>${'From: ',tx.addressFrom || 'From: '}</span>
      <span>${'To: ',tx.addressTo || 'To: '}</span>
      <span>${tx.amount || '0.00'} ETH</span>
    `;

    transactionsList.appendChild(row);
  });
}
     sendBtn.addEventListener('click', async(e) => {
        
        window.router.navigate('/send');
     });


    
    disconnectBtn.addEventListener('click', async(e) => {
            e.preventDefault();
            document.cookie = "locked = true";
            const text = currentAddress.textContent;
            await sendToWorker("LOCK", {address: text});
            window.router.navigate('/locked');

    });



    const rate = await getETHPriceFromAPI();
    fiatValue.textContent = "$"+ ((balance) * rate).toFixed(2); 
 }

 export async function setWallet(wallet1){
    try{
        wallet = wallet1;
    }
    catch(e){
        console.log(e.textContent);
    }
    
 }
