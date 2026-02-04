import {wallet, setWallet} from '/src/dashboard.js';



export async function initSettingsPage(){
    const currentAddress = document.getElementById("currentWalletAddress");
    const changePW = document.getElementById("changePasswordBtn");
    const addWallet = document.getElementById("addWalletBtn");
    const importWallet = document.getElementById("importWalletBtn");
    const removeWalletBtn = document.getElementById("removeThisWalletBtn");
    const reset = document.getElementById("resetEverythingBtn");
    const wallets = await window.db.getAllWallets();
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