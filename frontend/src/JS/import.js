import {ethers, Wallet} from 'ethers'
import { evaluatePasswordStrength, encryptData,  } from '../../../storage_logic/EncryptionUtils';



export function initImportPage(){
    const seed = document.getElementById("seedPhrase");
    const confirmButton = document.getElementById("importSubmitBtn");
    const walletName = document.getElementById("walletName");
    const password = document.getElementById("importPassword");
    const confirmPassword = document.getElementById("confirmImportPassword");
    const passwordStrengthDiv = document.getElementById("importStrength");
    const passwordMatchDiv = document.getElementById("importMatch");

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
            return;
        }
        if (evaluatePasswordStrength(password.value) < 3) {
            alert('Please choose a stronger password.');
            return;
        }

        if(seed.value == ""){
            alert("You must input a seedPhrase to go forward!");
            return;
        }

        
        const wallet = ethers.Wallet.fromPhrase(seed.value);
        if(!wallet){
            alert("invalid seed");
            return;
        }
        if(await db.getWallet(wallet.address)){
            alert("wallet already stored");
            router.navigate('/dashboard'); 
        }
        
        const encryptedData = await encryptData(wallet.privateKey, password.value);
        console.log('encrypt result', encryptedData);
        // support either { encryptedData, key } or { ciphertext, iv, salt, key }

        console.log("trying");
        if(!window.db){
            console.log("no DB :(");
        }
        console.log(window.db);
        try{
            console.log(encryptedData.ciphertext);
            console.log(encryptedData.password);
            await window.db.saveWallet(encryptedData, wallet.address, encryptedData.password);
            console.log(await window.db.getAllWallets());
        } catch (err) {
            console.error('Failed saving wallet', err);
            alert('Failed to save wallet. See console for details.');
            return;
        }
         
         
            

        confirm('Wallet Created succesfully! Your wallet address is: ' + wallet.address);
            window.router.navigate('/dashboard');
    });
    
    
}