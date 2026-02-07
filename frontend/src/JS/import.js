import {ethers, Wallet} from 'ethers'
import { evaluatePasswordStrength} from "./config.js";
import{sendToWorker} from '../../main.js';



export function initImportPage(){
    const seed = document.getElementById("seedPhrase");
    const confirmButton = document.getElementById("importSubmitBtn");
    const walletName = document.getElementById("walletName");
    const password = document.getElementById("importPassword");
    const confirmPassword = document.getElementById("confirmImportPassword");
    const passwordStrengthDiv = document.getElementById("importStrength");
    const passwordMatchDiv = document.getElementById("importMatch");
    const seedPhraseBtn = document.getElementById("toggleSeedPhrase");
    const pkBtn = document.getElementById("togglePK");
    let pkOrNot = false;

    seedPhraseBtn.addEventListener('click', async(e) => {
        if(pkOrNot){
            seedPhraseBtn.className="mode-btn active";
            pkBtn.className = "mode-btn";
            pkOrNot = false;
            seed.placeholder = "Enter your seed phrase here, separated by spaces.";
        }
        
    });

    pkBtn.addEventListener('click', async(e) => {
        if(!pkOrNot){
            seedPhraseBtn.className="mode-btn";
            pkBtn.className="mode-btn active";
            pkOrNot = true;
            seed.placeholder = "Enter your private key here, no spaces.";
        }
    })


    password.addEventListener('input', () => {
        const strength = evaluatePasswordStrength(password.value);
        const strengthTexts = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
        passwordStrengthDiv.textContent = `Strength: ${strengthTexts[strength]}`;
    });

    confirmPassword.addEventListener('input', () => {
        if (confirmPassword.value === password.value) {
            passwordMatchDiv.textContent = 'Passwords match';
            passwordMatchDiv.style.color = 'green';
        } else {
            passwordMatchDiv.textContent = 'Passwords do not match';
            passwordMatchDiv.style.color = 'red';
        }
    });

    confirmButton.addEventListener('click', async (e) => {
        e.preventDefault();
        if (password.value !== confirmPassword.value) {
            alert('Passwords do not match. Please try again.');
            router.navigate("/import");
        }
        if (evaluatePasswordStrength(password.value) < 3) {
            alert('Please choose a stronger password.');
            router.navigate("/import");
        }

        if(seed.value == ""){
            if(pkOrNot){
                alert("You must input a private key to go forward!");
            }
            else{
                alert("You must input a seedPhrase to go forward!");
            }
            router.navigate("/import");
        }
        let wallet;
        if(pkOrNot){
            const seed1 = seed.value.trim();
            const password1 = password.value;
            const name1 = walletName.value || "Wallet X";
             
            const payload = {seed: seed1, password: password1, name: name1};
            console.log(payload);
            wallet = await sendToWorker("IMPORT_PK", payload);
        }
        else{
             wallet = await sendToWorker("IMPORT_SEED",  {seed: seed.value, password: password.value, name: walletName.value});
        }
        if(!wallet){
            alert("invalid key");
            return;
        }    

        confirm('Wallet Created succesfully! Your wallet address is: ' + wallet.payload);
            window.router.navigate('/dashboard');
    });
    
    
}