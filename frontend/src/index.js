

export const HomePage = {
  template: `
    <div class="home-page">
      <header>
        <h1>🔐 My Crypto Wallet</h1>
        <p>Secure, non-custodial Ethereum wallet</p>
      </header>
      
      <div class="actions">
        <a href="/create" data-route class="btn btn-primary btn-large">
          Create New Wallet
        </a>
        
        <a href="/import" data-route class="btn btn-secondary btn-large">
          Import Existing Wallet
        </a>
        <a href="/dashboard" data-route class="btn btn-tertiary btn-large">
          View Dashboard
        </a>
      </div>
      
      <div class="info">
        <h3>⚠️ Security First</h3>
        <ul>
          <li>Private keys never leave your device</li>
          <li>No servers - everything runs locally</li>
          <li>Encrypted with your password</li>
        </ul>
      </div>
    </div>
  `,
  
  init: () => {
    console.log('Home page loaded');
    // Any home-page specific initialization
  }
};

export const CreateWalletPage = {
  template: `
    <div class="create-wallet-page">
      <header>
        <a href="/" data-route class="back-link">← Back</a>
        <h1>Create New Wallet</h1>
      </header>
      
      <form id="createWalletForm" class="wallet-form">
        <div class="form-group">
          <label for="password">Set a strong password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Minimum 8 characters" 
            required
            minlength="8"
          >
          <div class="password-strength"></div>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            placeholder="Re-enter your password" 
            required
          >
          <div class="password-match"></div>
        </div>
        
        <div class="form-group">
          <label class="checkbox">
            <input type="checkbox" id="terms" required>
            I understand that I am solely responsible for securing my seed phrase
          </label>
        </div>
        
        <button id ="submit" type="submit" class="btn btn-primary btn-large">
          Generate Wallet
        </button>
      </form>
      
      <div class="warning-box">
        <strong>Important:</strong>
        <p>You'll be given a 12-word seed phrase. Write it down and store it securely. 
           We cannot recover it if you lose it.</p>
      </div>
    </div>
  `,
  
  init: async () => {
    console.log('Create wallet page loaded');
    await import('/src/createWallet.js').then(module => module.initWalletCreation && module.initWalletCreation());
  }
};

export const DashboardPage = {
  template: `
    <div class="dashboard-page">
      <nav class="wallet-nav">
        <div class="wallet-info">
          <span class="wallet-address" id="currentAddress"></span>
          <button id="disconnectBtn" class="btn-small">Lock</button>
        </div>
        
        <div class="nav-links">
          <a href="/dashboard" data-route class="nav-link active">💰 Balance</a>
          <a href="/send" data-route class="nav-link">📤 Send</a>
          <a href="/receive" data-route class="nav-link">📥 Receive</a>
          <a href="/settings" data-route class="nav-link">⚙️ Settings</a>
        </div>
      </nav>
      
      <main class="dashboard-content">
        <div class="balance-card">
          <h2>Total Balance</h2>
          <div class="balance-amount" id="balanceDisplay">0.00 ETH</div>
          <div class="balance-fiat" id="fiatValue">$0.00</div>
        </div>
        
        <div class="actions-row">
          <button id="sendBtn" class="action-btn">Send</button>
          <button id="receiveBtn" class="action-btn">Receive</button>
          <button id="swapBtn" class="action-btn">Swap</button>
          <button id="buyBtn" class="action-btn">Buy</button>
        </div>
        
        <div class="transactions-section">
          <h3>Recent Transactions</h3>
          <div id="transactionsList" class="transactions-list">
            <!-- Transactions will be loaded here -->
          </div>
        </div>
      </main>
    </div>
  `,
  
  init: async () => {
    console.log('Dashboard loaded');
    const { initDashboard } = await import('./dashboard.js');
    initDashboard();
  }
};