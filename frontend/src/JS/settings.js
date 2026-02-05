import {wallet, setWallet} from '/src/JS/dashboard.js';
import {ethers} from 'ethers';


let selectedWallet = null;
let walletContainer;

let wallets;




export async function initSettingsPage(){
    const currentAddress = document.getElementById("currentWalletAddress");
    const changePW = document.getElementById("changePasswordBtn");
    const addWallet = document.getElementById("addWalletBtn");
    const importWallet = document.getElementById("importWalletBtn");
    const removeWalletBtn = document.getElementById("removeThisWalletBtn");
    const reset = document.getElementById("resetEverythingBtn");
    wallets = await window.db.getAllWallets();

    walletContainer = document.getElementById("walletsContainer");
    renderWallets();



    console.log(await window.provider.listAccounts());
    if(!wallet && wallets.length != 0){
         setWallet(wallets[0]);
    }
    

    currentAddress.textContent = wallet.address;

    addWallet.addEventListener('click', async (e) => {
        window.router.navigate('/create');
    });
    importWallet.addEventListener('click', async(e) =>{
        window.router.navigate('/import');
    });

    removeWalletBtn.addEventListener('click', async(e)=>{
        console.log("listening");
        let prom = await window.db.deleteWallet(wallet.address);
        if(wallets.length != 1){
            
            setWallet(wallets[0]);
        }
        else{

            setWallet(null);
        }

         window.router.navigate('/dashboard');
        console.log("rerouting");
        
    })

    reset.addEventListener('click', async (e) => {
        let prompt = await window.db.clearDatabase();
        window.router.navigate('/');
    } );

    changePW.addEventListener('click', async(e) =>{
        let verification = prompt("To change your password please input your old one: " , "password");
        if(verification === wallet.key){
            let newPW = prompt("Please enter your new Password: ", "newPassword");
            let req = await window.db.changePassword(wallet.address,newPW);
            if(req){
                alert("Password changed succesfully!");
            }
            else{
                alert("Something went wrong. Try again later.");
            }
        }
        else{
            alert("Wrong password Loser.");
        }
    })

}


function renderWallets() {
  walletContainer.innerHTML = ''; 
  
  wallets.forEach(wl => {
    const item = document.createElement('div');
    item.className = 'wallet-item';
    item.textContent = `${wl.name} - ${wl.address}`;
    item.dataset.id = wl.id;
    
    // Mark as selected if this is the selected wallet
    if (selectedWallet && selectedWallet.id === wl.id) {
      item.classList.add('selected');
    }
    
    // Add click event
    item.addEventListener('click', () => {
      // Remove selection from all items
      document.querySelectorAll('.wallet-item').forEach(el => {
        el.classList.remove('selected');
      });
      
      // Add selection to clicked item
      item.classList.add('selected');
      
      // Update the selectedWallet variable
      selectedWallet = wl;
      setWallet(wl);
      
      
      // You can now use selectedWallet elsewhere in your code
      console.log('Selected wallet:', selectedWallet);
      
      // Or trigger a custom event
      const event = new CustomEvent('walletSelected', { 
        detail: { wl: selectedWallet } 
      });
      walletContainer.dispatchEvent(event);
    });
    
    walletContainer.appendChild(item);
  });
}