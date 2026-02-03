import { db} from '../main.js';
import{ethers} from 'ethers';





export async function initDashboard(){
    const balanceDisplay = document.getElementById('balanceDisplay');
    const fiatValue = document.getElementById('fiatValue');
    const transactionsList = document.getElementById('transactionsList');
    const currentAddress = document.getElementById('currentAddress');
    const disconnectBtn = document.getElementById('disconnectBtn');
    const provider = ethers.getDefaultProvider();
    
    const wallets = await db.getAllWallets(); // Get the last created wallet
    const wallet = wallets[0];
    console.log(wallet);
    if(!wallet){
        alert('No wallet found. Please create a wallet first.');
        window.router.navigate('/create');
        return;
    }

    currentAddress.textContent = `Address: ${wallet.address}`;
    balanceDisplay.textContent = await provider.getBalance(wallet.address) + ' ETH';
    transactionsList.textContent = wallet.transactionsList || 'No transactions yet';



}