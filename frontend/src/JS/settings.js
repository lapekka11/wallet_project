import {wallet, setWallet} from '/src/JS/dashboard.js';
import {ethers} from 'ethers';
import { decryptData } from '../../../storage_logic/EncryptionUtils';


let selectedWallet = null;
let walletContainer;

let wallets;
let currentAddress;



export async function initSettingsPage(){
    if(document.cookie.includes("locked=true")) {
        window.router.navigate('/locked');
        return;
    }
     currentAddress = document.getElementById("currentWalletAddress");
    const changePW = document.getElementById("changePasswordBtn");
    const addWallet = document.getElementById("addWalletBtn");
    const importWallet = document.getElementById("importWalletBtn");
    const removeWalletBtn = document.getElementById("removeThisWalletBtn");
    const reset = document.getElementById("resetEverythingBtn");
    const lockWallet = document.getElementById("lockWalletBtn");
    wallets = window.sUtils.wallets || await window.sUtils.getAllWallets();
    const unlock = document.getElementById("unlockWallet");
    const lockScreen = document.getElementById("lock-overlay");
    const unlockPassword = document.getElementById("unlockPassword");
    const networkSelect = document.getElementById("networkSelect");
    const copyAddressBtn = document.getElementById("copyAddressBtn");

    copyAddressBtn.addEventListener('click', async() => {
        if(wallet){
            await navigator.clipboard.writeText(wallet.address);
            alert("Address copied to clipboard!");
        }
        else{
            alert("No wallet selected!");
        }
    });


   const currentNetwork = await window.sUtils.getNetwork();
   networkSelect.value = currentNetwork; 
   networkSelect.addEventListener("change", async () => {
        const selected = networkSelect.value;
        await window.sUtils.setNetwork(selected);
        location.reload(); 
    });


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
        let prom = await window.sUtils.deleteWallet(wallet.address);
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
        let prompt = await window.sUtils.selfDestruct.clearDatabase();
        location.reload();
        window.router.navigate('/');
    } );

    changePW.addEventListener('click', async(e) =>{
        let verification = prompt("To change your password please input your old one: " , "password");
        const password = await decryptData(wallet.key, verification);
        if(verification === password){
            let newPW = prompt("Please enter your new Password: ", "newPassword");
            let req = await window.sUtils.changePassword(wallet.address,newPW);
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
    });
 lockWallet.addEventListener('click', async(e) => {
            e.preventDefault();
            console.log("nia");
            
            document.cookie = "locked = true";
            window.router.navigate('/locked');

    });

   

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
      window.sUtils.updateCurrWallet(selectedWallet);
      currentAddress.textContent = selectedWallet.address;
      
      
      // You can now use selectedWallet elsewhere in your code
      console.log('Selected wallet:', selectedWallet);
      window.router.navigate('/dashboard');

    });
    
    walletContainer.appendChild(item);
    
  });
}