import{ethers} from 'ethers';
import { getETHPriceFromAPI } from './config';



 export let wallet = null;
 export let wallets;


 export async function initDashboard(){

    if(document.cookie.includes("locked=true")) {
        window.router.navigate('/locked');
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
     


    
    const dbInstance = window.sUtils;
    console.log(dbInstance.db);
    if (!dbInstance || !dbInstance.db) {
        console.error('DB not initialized in dashboard');
        alert('Storage not ready — reload the app.');
        window.router.navigate('/');
        return;
    }
    
    try {
        wallets = dbInstance.wallets || await dbInstance.getAllWallets();
    } catch (err) {
        console.error('Error fetching wallets', err);
        alert('Failed to load wallets. See console for details.');
        window.router.navigate('/create');
        return;
    }
     wallet = dbInstance.currWallet;
     console.log(wallet);
     console.log(wallets);
     if(!wallet){
         alert('No wallet found. Please create a wallet first.');
         window.router.navigate('/create');
         return;
     }

 
     currentAddress.textContent = `Address: ${wallet.address}`;
     console.log(wallet);
     const balance = ethers.formatEther( await provider.getBalance(wallet.address));
     balanceDisplay.textContent = balance + ' ETH';
     const transactions = await window.sUtils.updateRecentTransactions(wallet) ;
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
            console.log("nia");
            document.cookie = "locked = true";
            window.router.navigate('/locked');


    });



    const rate = await getETHPriceFromAPI();
    console.log(rate);
    fiatValue.textContent = "$"+ ((balance) * rate).toFixed(2); 
 }

 export async function setWallet(wallet1){
    try{
        wallet = wallet1;
        console.log("killa");
    }
    catch(e){
        console.log(e.textContent);
    }
    
 }

//export async function initDashboard(){
//    const balanceDisplay = document.getElementById('balanceDisplay');
//    const fiatValue = document.getElementById('fiatValue');
//    const transactionsList = document.getElementById('transactionsList');
//    const currentAddress = document.getElementById('currentAddress');
//    const disconnectBtn = document.getElementById('disconnectBtn');
//    const provider = ethers.getDefaultProvider();
//    
//    const wallets = await db.getAllWallets(); 
//    const wallet = wallets[0];
//    console.log(wallet);
//    console.log(wallets);
//    if(!wallet){
//        alert('No wallet found. Please create a wallet first.');
//        window.router.navigate('/create');
//        return;
//    }
//
//    currentAddress.textContent = `Address: ${wallet.address}`;
//    balanceDisplay.textContent = await provider.getBalance(wallet.address) + ' ETH';
//    transactionsList.textContent = wallet.transactionsList || 'No transactions yet';
//
//}