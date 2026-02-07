import { decryptData } from "../../../storage_logic/EncryptionUtils";

export function initLockPage(){
    const unlock = document.getElementById('unlockWallet');
    const lockScreen = document.getElementById('lockScreen');
    const unlockPassword = document.getElementById('unlockPassword');
                   console.log("niania" + window.sUtils.locked);

    console.log(window.sUtils.getLocking());
 unlock.addEventListener('click' , async(e) => {
       e.preventDefault();
       const password= await decryptData(window.sUtils.currWallet.key, unlockPassword.value);

            if(unlockPassword.value === password){
                document.cookie = "locked = false";
                window.router.navigate('/dashboard');            }     
            else{
                alert("incorrect password");
            }       
        
       
    });

}         