import {ethers} from 'ethers';

import { deriveKey, encryptData, decryptData ,evaluatePasswordStrength } from '../../storage_logic/EncryptionUtils.js';

class Wallet {
    constructor(password,address){
        this.password = password;
        this.address = address;
        this.transactions =[];
    }
}


export async function initWalletCreation(){
    console.log('Initializing wallet creation scripts');
    const submit = document.getElementById('submit');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const passwordStrengthDiv = document.querySelector('.password-strength');
    const passwordMatchDiv = document.querySelector('.password-match');
    const createWalletForm = document.getElementById('createWalletForm');

   

    passwordField.addEventListener('input', () => {
        const strength = evaluatePasswordStrength(passwordField.value);
        const strengthTexts = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
        passwordStrengthDiv.textContent = `Strength: ${strengthTexts[strength]}`;
    });

    confirmPasswordField.addEventListener('input', () => {
        if (confirmPasswordField.value === passwordField.value) {
            passwordMatchDiv.textContent = 'Passwords match';
            passwordMatchDiv.style.color = 'green';
        } else {
            passwordMatchDiv.textContent = 'Passwords do not match';
            passwordMatchDiv.style.color = 'red';
        }
    });

    submit.addEventListener('click', async (e) => {
        e.preventDefault();
        if (passwordField.value !== confirmPasswordField.value) {
            alert('Passwords do not match. Please try again.');
            return;
        }
        if (evaluatePasswordStrength(passwordField.value) < 3) {
            alert('Please choose a stronger password.');
            return;
        }
        if(!document.getElementById('terms').checked) {
            alert('You must agree to the terms to proceed.');
            return;
        }
        
        const wallet = ethers.Wallet.createRandom();

        let seedPhrase = wallet.mnemonic.phrase;
        let prompt = confirm('Your seed phrase (write it down and keep it safe): \n'+ seedPhrase);
        if(!prompt){
            
           alert('Wallet Creation cancelled. Please make sure to back up your seed phrase next time.');
        }
        const encryptedData = await encryptData(wallet.privateKey, passwordField.value);
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

