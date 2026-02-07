import { sendToWorker } from "../../main.js";

export function initLockPage(){
    const unlock = document.getElementById('unlockWallet');
    const lockScreen = document.getElementById('lockScreen');
    const unlockPassword = document.getElementById('unlockPassword');

     unlock.addEventListener('click' , async(e) => {
       e.preventDefault();
       const addy = (await sendToWorker("GET_CURRWALLET")).address;
       const pass = unlockPassword.value;
       const password= await sendToWorker("CHECK_PASS",pass);
       
            console.log(password);
            if(password.payload === "true"){
                document.cookie = "locked=false";
                await sendToWorker("UNLOCK", { key: pass, address: addy });
                window.router.navigate('/dashboard');            
            }     
            else{
                            console.log("NAOAONAOAND" + password.payload);
                alert("incorrect password");
            }       
        
       
    });

}         