import { sendToWorker } from "../../main.js";

export function initLockPage(){
    const unlock = document.getElementById('unlockWallet');
    const lockScreen = document.getElementById('lockScreen');
    const unlockPassword = document.getElementById('unlockPassword');

     unlock.addEventListener('click' , async(e) => {
       e.preventDefault();
       console.log(await sendToWorker("GET_CURRWALLET"));
       const password= await sendToWorker("CHECK_PASS",unlockPassword.value);
       
            console.log(password);
            if(password.payload === "true"){
                document.cookie = "locked=false";
                await sendToWorker("UNLOCK", unlockPassword.value);
                window.router.navigate('/dashboard');            }     
            else{
                            console.log("NAOAONAOAND" + password.payload);
                alert("incorrect password");
            }       
        
       
    });

}         