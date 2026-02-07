export const NETWORKS = {
  mainnet: {
    name: "Ethereum Mainnet",
    chainId: 1,
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_KEY",
    symbol: "ETH",
  },
  sepolia: {
    name: "Sepolia Testnet",
    chainId: 11155111,
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_KEY",
    symbol: "ETH",
  },
  localhost: {
    name: "Localhost",
    chainId: 31337,
    rpcUrl: "http://127.0.0.1:9545",
    symbol: "ETH",
  },
};

export async function getETHPriceFromAPI() {
    try {
        // Coingecko API +
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        return data.ethereum.usd;
        
    } catch (error) {
        console.error('Coingecko API failed:', error);
        
     {            
            // Final fallback to Binance
            try {
                const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
                const data = await response.json();
                return parseFloat(data.price);
            } catch (error3) {
                console.error('All APIs failed, using default:', error3);
                return 3500; // Default fallback price
            }
        }
    }
};

export 
 function evaluatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    }
