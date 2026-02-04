

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
          <a href="/" data-route class="nav-link active">Back</a>
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

export const ImportPage = {
  template: `
  <head>
   <link rel="stylesheet" href="/src/import.css">
   </head>
<div class="import-page">
  <nav class="page-nav">
    <div class="nav-back">
      <a href="/" data-route class="back-link">← Back to Home</a>
    </div>
    <h1 class="page-title">Access Your Wallet</h1>
  </nav>
  
  <div class="import-container">
    <!-- Toggle between Import and Unlock -->
    <div class="mode-toggle">
      <button id="toggleImport" class="mode-btn active">📤 Import Wallet</button>
      <button id="toggleUnlock" class="mode-btn">🔓 Unlock Wallet</button>
    </div>
    
    <!-- Import Wallet Section (Seed Phrase) -->
    <div id="importSection" class="import-section active">
      <div class="import-header">
        <h2>Import with Seed Phrase</h2>
        <p class="subtitle">Enter your 12, 18, or 24 word recovery phrase</p>
      </div>
      
      <form id="importForm" class="import-form">
        <div class="form-group">
          <label for="seedPhrase">Recovery Phrase</label>
          <textarea 
            id="seedPhrase" 
            class="seed-input"
            placeholder="Enter your seed phrase here, separated by spaces"
            rows="3"
            required
          ></textarea>
          <div class="input-hint">
            <span id="wordCount">Words: 0</span>
            <span class="valid-words">12, 18, or 24 words</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="importPassword">Set a password</label>
          <input 
            type="password" 
            id="importPassword" 
            placeholder="Create a strong password"
            required
            minlength="8"
            class="form-input"
          >
          <div class="password-strength" id="importStrength"></div>
        </div>
        
        <div class="form-group">
          <label for="confirmImportPassword">Confirm password</label>
          <input 
            type="password" 
            id="confirmImportPassword" 
            placeholder="Re-enter your password"
            required
            class="form-input"
          >
          <div class="password-match" id="importMatch"></div>
        </div>
        
        <div class="form-group">
          <label for="walletName">Wallet Name (Optional)</label>
          <input 
            type="text" 
            id="walletName" 
            placeholder="e.g., My Main Wallet"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label class="checkbox">
            <input type="checkbox" id="importTerms" required>
            <span>I understand this will create a new encrypted wallet file. My seed phrase is not sent anywhere.</span>
          </label>
        </div>
        
        <button type="submit" class="btn btn-primary btn-large" id="importSubmitBtn">
          Import Wallet
        </button>
      </form>
      
      <div class="security-tips">
        <h3>🔒 Security Tips:</h3>
        <ul>
          <li>Never share your seed phrase with anyone</li>
          <li>Make sure nobody is watching your screen</li>
          <li>Consider using a hardware wallet for large amounts</li>
        </ul>
      </div>
    </div>
    
    <!-- Unlock Wallet Section (Existing Wallet) -->
    <div id="unlockSection" class="import-section">
      <div class="import-header">
        <h2>Unlock Existing Wallet</h2>
        <p class="subtitle">Select a wallet and enter your password</p>
      </div>
      
      <form id="unlockForm" class="import-form">
        <!-- Wallet Selection -->
        <div class="form-group">
          <label for="walletSelect">Select Wallet</label>
          <div class="wallet-select-container">
            <select id="walletSelect" class="form-input" required>
              <option value="" disabled selected>Select a wallet...</option>
              <!-- Wallets will be populated dynamically -->
            </select>
            <button type="button" id="refreshWallets" class="btn-small">↻</button>
          </div>
          
          <!-- Wallet Preview -->
          <div id="walletPreview" class="wallet-preview" style="display: none;">
            <div class="wallet-preview-item">
              <span class="wallet-icon">👛</span>
              <div class="wallet-details">
                <strong id="previewName">Wallet Name</strong>
                <small id="previewAddress">0x0000...0000</small>
                <small id="previewNetwork">Network: Ethereum</small>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Password Input -->
        <div class="form-group">
          <label for="unlockPassword">Password</label>
          <div class="password-input-container">
            <input 
              type="password" 
              id="unlockPassword" 
              placeholder="Enter your wallet password"
              required
              class="form-input"
            >
            <button type="button" id="togglePassword" class="btn-small">👁️</button>
          </div>
          <div class="password-hint">
            <span id="passwordHint"></span>
            <a href="#" id="forgotPassword" class="text-link">Forgot password?</a>
          </div>
        </div>
        
        <!-- Remember Me Option -->
        <div class="form-group">
          <label class="checkbox">
            <input type="checkbox" id="rememberMe">
            <span>Remember this device for 24 hours</span>
          </label>
        </div>
        
        <!-- Action Buttons -->
        <div class="unlock-actions">
          <button type="submit" class="btn btn-primary btn-large" id="unlockSubmitBtn">
            🔓 Unlock Wallet
          </button>
          <button type="button" id="removeWalletBtn" class="btn btn-danger">
            🗑️ Remove Wallet
          </button>
        </div>
      </form>
      
      <!-- Import Alternative -->
      <div class="alternative-options">
        <p>Don't see your wallet? <a href="#" id="switchToImport">Import with seed phrase</a></p>
        <p>New to crypto? <a href="/create" data-route>Create a new wallet</a></p>
      </div>
    </div>
    
    <!-- Loading State -->
    <div id="loadingState" class="loading-state" style="display: none;">
      <div class="loading-spinner"></div>
      <p id="loadingText">Processing...</p>
    </div>
    
    <!-- Error Display -->
    <div id="errorDisplay" class="error-display" style="display: none;">
      <div class="error-icon">⚠️</div>
      <div class="error-content">
        <h4 id="errorTitle">Error</h4>
        <p id="errorMessage"></p>
        <button id="dismissError" class="btn-small">Dismiss</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal for Remove Confirmation -->
<div id="removeModal" class="modal" style="display: none;">
  <div class="modal-content">
    <div class="modal-header">
      <h3>⚠️ Remove Wallet</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to remove this wallet from this device?</p>
      <p><strong>Warning:</strong> You will need your seed phrase to restore it.</p>
      <div class="modal-actions">
        <button id="confirmRemove" class="btn btn-danger">Yes, Remove</button>
        <button id="cancelRemove" class="btn btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal for Forgot Password -->
<div id="forgotModal" class="modal" style="display: none;">
  <div class="modal-content">
    <div class="modal-header">
      <h3>🔑 Forgot Password</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <p>If you forgot your password:</p>
      <ol>
        <li>Remove the wallet from this device</li>
        <li>Import it again with your seed phrase</li>
        <li>Set a new password</li>
      </ol>
      <p><strong>Important:</strong> We cannot recover your password. Your seed phrase is your only backup.</p>
      <div class="modal-actions">
        <button id="proceedToRemove" class="btn btn-primary">Remove & Re-import</button>
        <button id="cancelForgot" class="btn btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
</div>
  `,
  
  init: async () => {
    console.log('ImportPage loaded');
    const { initImportPage } = await import('./import.js');
    initImportPage();
  }
};