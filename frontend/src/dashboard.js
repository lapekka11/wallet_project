import{ethers} from 'ethers';



 export async function initDashboard(){
     const balanceDisplay = document.getElementById('balanceDisplay');
     const fiatValue = document.getElementById('fiatValue');
     const transactionsList = document.getElementById('transactionsList');
     const currentAddress = document.getElementById('currentAddress');
     const disconnectBtn = document.getElementById('disconnectBtn');
     const provider = ethers.getDefaultProvider();
    
    const dbInstance = window.db;
    if (!dbInstance || !dbInstance.db) {
        console.error('DB not initialized in dashboard');
        alert('Storage not ready — reload the app.');
        window.router.navigate('/create');
        return;
    }
    
    let wallets;
    try {
        wallets = await dbInstance.getAllWallets();
    } catch (err) {
        console.error('Error fetching wallets', err);
        alert('Failed to load wallets. See console for details.');
        window.router.navigate('/create');
        return;
    }
     const wallet = wallets[0];
     console.log(wallet);
     console.log(wallets);
     if(!wallet){
         alert('No wallet found. Please create a wallet first.');
         window.router.navigate('/create');
         return;
     }
 
     currentAddress.textContent = `Address: ${wallet.address}`;
     balanceDisplay.textContent = await provider.getBalance(wallet.address) + ' ETH';
     transactionsList.textContent = wallet.transactionsList || 'No transactions yet';
 
 
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
//
//
//}