import {wallet, setWallet} from '/src/JS/dashboard.js';
import {ethers} from 'ethers';
import {sendToWorker} from '../../main.js';

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
    wallets = (await sendToWorker("GET_ALL_WALLETS")).payload;
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


   const currentNetwork = (await sendToWorker("GET_NETWORK_NAME")).payload;
   networkSelect.value = currentNetwork; 
   networkSelect.addEventListener("change", async () => {
        const selected = networkSelect.value;
        await sendToWorker("SET_NETWORK", selected);
        location.reload(); 
    });


    walletContainer = document.getElementById("walletsContainer");
    renderWallets();



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
        const addy = currentAddress.textContent;
        let prom = await sendToWorker("DELETE_WALLET", addy);
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
        let prompt = await sendToWorker("SELF_DESTRUCT");
        location.reload();
        window.router.navigate('/');
    } );

    changePW.addEventListener('click', async(e) =>{
        let verification = prompt("To change your password please input your old one: " , "password");
        const password = (await sendToWorker("CHECK_PASS",verification));

        if(password.type === "SUCCESS"){
            let newPW = prompt("Please enter your new Password: ", "newPassword");
            let address = currentAddress.textContent;
            console.log(address);
            let req = await sendToWorker("CHANGE_PW", {address: address,password: newPW, oldPassword: verification});
            if(req){
                alert("Password changed succesfully!");
                location.reload();
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
            const text = currentAddress.textContent;
            await sendToWorker("LOCK", {address: text});
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
    item.addEventListener('click', async(e) => {
      // Remove selection from all items
      document.querySelectorAll('.wallet-item').forEach(el => {
        el.classList.remove('selected');
      });
      
      // Add selection to clicked item
      item.classList.add('selected');
      
      // Update the selectedWallet variable
      selectedWallet = wl;
      await sendToWorker("SET_CURRWALLET", wl.address);
      currentAddress.textContent = selectedWallet.address;
      
      
      // You can now use selectedWallet elsewhere in your code
      console.log('Selected wallet:', selectedWallet);
      window.router.navigate('/dashboard');

    });
    
    walletContainer.appendChild(item);
    
  });
}