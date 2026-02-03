const home = document.getElementById('home');
const walletCreationContainer = document.getElementById('walletCreationContainer');

const homeWalletRedirect = document.getElementById('homeWalletRedirect');



const createButton = document.getElementById('createWalletBtn');
const walletNameInput = document.getElementById('walletName');
const passwordInput = document.getElementById('walletPassword');
const addressField = document.getElementById('walletAddress');


homeWalletRedirect.addEventListener('click', () => {
    console.log("slkdfnlsdfm");
    home.style.display = 'none';
    walletCreationContainer.style.display = 'block';
});


createButton.addEventListener('click', async () => {
    const walletName = walletNameInput.value;
    const password = passwordInput.value;
    const confirmedPassword = document.getElementById('confirmedPassword').value;
    if (!walletName || !password) {
        alert('Please enter both wallet name and password.');
        return;
    }
    else if(confirmedPassword !== password) {
        alert('Passwords do not match. Please try again.');
        return;
    }

    try{
        const wallet = await createWallet(password);
        addressField.textContent = wallet.address;
        document.getElementById('preCreation').style.display = 'none';
        document.getElementById('postCreation').style.display = 'block';
    } catch (error) {
        alert('Failed to create wallet: ' + error.message);
    }
});