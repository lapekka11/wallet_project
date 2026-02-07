import {ethers} from 'ethers';

import { deriveKey, encryptData, decryptData ,evaluatePasswordStrength } from '../../../storage_logic/EncryptionUtils';

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
    const nameField = document.getElementById("name");

   

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
        console.log(nameField.value);
        if(nameField.value == ""){
            nameField.value = "wallet X";
        }
        const wallet = ethers.Wallet.createRandom().connect(window.provider);

        let seedPhrase = wallet.mnemonic.phrase;
        let prompt = confirm('Your seed phrase (write it down and keep it safe): \n'+ seedPhrase);
        if(!prompt){
            
           alert('Wallet Creation cancelled. Please make sure to back up your seed phrase next time.');
           location.reload();
           return;
        }
        const encryptedData = await encryptData(wallet.privateKey, passwordField.value);
        const encryptedPassword = await encryptData(passwordField.value, passwordField.value);
        console.log('encrypt result', encryptedData);
        // support either { encryptedData, key } or { ciphertext, iv, salt, key }

        console.log("trying");
        if(!window.sUtils){
            console.log("no DB :(");
        }
        console.log(window.sUtils);
        try{
            console.log(encryptedData.ciphertext);
            console.log(encryptedPassword.ciphertext);



            await window.sUtils.saveWallet(encryptedData, wallet.address, encryptedPassword, nameField.value);
            console.log(window.sUtils);
           const wallets =  await window.sUtils.updateWallets();
           const currWallet = await window.sUtils.updateCurrWallet(wallet);
           console.log(wallets);
                    try {
          const funder = window.provider.listAccounts(); // first unlocked account from hardhat node
            await window.provider.send('eth_sendTransaction', [{
                from: funder[0],
                to: wallet.address,
                value: '0x16345785d8a0000' // 0.1 ETH in hex wei
              }]);
              console.log('Funded wallet via eth_sendTransaction', wallet.address);
        } catch (err) {
          console.warn('Could not auto-fund wallet (node may be down or signer not available):', err);
        }
        } catch (err) {
            console.error('Failed saving wallet', err);
            alert('Failed to save wallet. See console for details.');
            return;
        }
         
         
            

        confirm('Wallet Created succesfully! Your wallet address is: ' + wallet.address);
            window.router.navigate('/dashboard');
    });
}

