import {ethers} from 'ethers';
import{sendToWorker} from '../../main.js';
import { evaluatePasswordStrength } from './config.js';
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

    try{        
        const receipt = await sendToWorker("SAVE_WALLET",{
            password: passwordField.value,
            name: nameField.value
        });
        let seedPhrase = receipt.payload.mnemonic;
        let prompt = confirm('Your seed phrase: \n'+ seedPhrase + "\n Write it down and keep it safe while we generate your wallet. It may take a second...");
        
    
        confirm('Wallet Created succesfully! Your wallet address is: ' + receipt.payload.address);
            window.router.navigate('/dashboard');
    }
    catch(e){
        alert("Wallet creation failed because of: " + e.textContent);
    }
    });
}

