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
