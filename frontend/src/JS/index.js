

export const HomePage = {
  template: `
  <head>
  <link rel="stylesheet" href="/src/CSS/home.css">
  </head>
    <div class="home-page">
      <header>
        <h1>MetaClone</h1>
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
        <h3>Security First</h3>
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
  <head>
  <link rel="stylesheet" href="/src/CSS/walletCreation.css">
  </head>
    <div class="create-wallet-page">
      <header>
        <a href="/" data-route class="back-link">← Back</a>
        <h1>Create New Wallet</h1>
      </header>
      
      <form id="createWalletForm" class="wallet-form">
        <div class="form-group">
        <label for="name"> Set a Name (Optional) </label> 
        <input 
          type="name"
          id="name"
          placeholder= "wallet X"
          >
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
    await import('/src/JS/createWallet.js').then(module => module.initWalletCreation && module.initWalletCreation());
  }
};

export const DashboardPage = {
  template: `
  <head>
  <link rel="stylesheet" href="/src/CSS/dashboard.css">
  </head>
    <div class="dashboard-page">
      <nav class="wallet-nav">
        <div class="wallet-info">
          <span class="wallet-address" id="currentAddress"></span>
          <button id="disconnectBtn" class="btn-small">Lock</button>
        </div>
        
        <div class="nav-links">
          <a href="/" data-route class="nav-link active">Back</a>
          <a href="/settings" data-route class="nav-link">Settings</a>
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

    <!-- Lock Screen Overlay -->
<div id="lock-overlay" class="lock-overlay" style="display: none;">
  <div class="lock-modal">
    <h2>🔒 Wallet Locked</h2>
    <p>Enter your password or private key to unlock.</p>

    <form class="lock-form">
      <div class="form-group">
        <label for="unlockPassword">Password</label>
        <input
          type="password"
          id="unlockPassword"
          placeholder="Enter your password"
        />
      </div>
      <button id="unlockWallet" class="btn btn-primary btn-large">
        Unlock Wallet
      </button>
    </form>
  </div>
</div>

  `,
  
  init: async () => {
    console.log('Dashboard loaded');
    const { initDashboard } = await import('./dashboard.js');
    initDashboard();
  }
};

export const SettingsPage ={
    template:`
      <head>
  <link rel="stylesheet" href="/src/CSS/settings.css">
  </head>
     <div class="settings-page"> 
  <nav class="settings-nav">
    <div class="nav-back">
      <a href="/dashboard" data-route class="back-link">← Back to Dashboard</a>
    </div>
    <h1 class="page-title">Settings</h1>
  </nav>
  
  <div class="settings-container">
    <!-- Profile Section -->
    <div class="settings-section">
      <h2 class="section-title">Profile</h2>
      <div class="settings-card">
        <div class="profile-info">
          <div class="profile-avatar">
            <div class="avatar-icon">👤</div>
          </div>
          <div class="profile-details">
            <h3 id="profileName">My Wallet</h3>
            <div class="wallet-address-display">
              <span id="currentWalletAddress">0x0000...0000</span>
              <button id="copyAddressBtn" class="btn-small">📋 Copy</button>
            </div>
            <div class="profile-meta">
              <span class="meta-item">Network: <span id="currentNetwork">Sepolia</span></span>
            </div>
          </div>
        </div>
        
        <div class="profile-actions">
        </div>
      </div>
    </div>
    
    <!-- Security Section -->
    <div class="settings-section">
      <h2 class="section-title">Security</h2>
      <div class="settings-card">
        <div class="security-item">
          <div class="security-info">
            <h4>Change Password</h4>
            <p>Update your wallet encryption password</p>
          </div>
          <button id="changePasswordBtn" class="btn btn-secondary">Change</button>
        </div>
        
        <div class="security-item">
          <div class="security-info">
            <h4>Auto-lock Timer</h4>
            <p>Automatically lock wallet after inactivity</p>
          </div>
          <div class="security-control">
            <select id="autoLockSelect" class="form-select">
              <option value="1">1 minute</option>
              <option value="5" selected>5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="0">Never (not recommended)</option>
            </select>
          </div>
        </div>
        
        <div class="security-item">
          <div class="security-info">
            <h4>Backup & Recovery</h4>
            <p>View your seed phrase or export backup</p>
          </div>
          <div class="security-actions">
            <button id="exportBackupBtn" class="btn btn-secondary">Export Backup</button>
          </div>
        </div>
        
        <div class="security-item">
          <div class="security-info">
            <h4>Session Management</h4>
            <p>Manage active sessions and devices</p>
          </div>
          <button id="manageSessionsBtn" class="btn btn-secondary">Manage</button>
        </div>
      </div>
    </div>
    
    <!-- Network & Preferences -->
    <div class="settings-section">
      <h2 class="section-title">Network & Preferences</h2>
      <div class="settings-card">
        <div class="preference-item">
          <div class="preference-info">
            <h4>Default Network</h4>
            <p>Choose which network to connect to by default</p>
          </div>
          <div class="preference-control">
            <select id="networkSelect" class="form-select">
              <option value="ethereum">Ethereum Mainnet</option>
              <option value="sepolia" selected>Sepolia Testnet</option>
              <option value="goerli">Hardhat Testnet</option>
            </select>
          </div>
        </div>
        
        <div class="preference-item">
          <div class="preference-info">
            <h4>Currency Display</h4>
            <p>Choose your preferred currency</p>
          </div>
          <div class="preference-control">
            <select id="currencySelect" class="form-select">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="ETH">ETH</option>
            </select>
          </div>
        </div>
        
        <div class="preference-item">
          <div class="preference-info">
            <h4>Theme</h4>
            <p>Choose your interface theme</p>
          </div>
          <div class="theme-options">
            <label class="theme-option">
              <input type="radio" name="theme" value="dark" checked>
              <span class="theme-preview dark-theme"></span>
              <span>Dark</span>
            </label>
            <label class="theme-option">
              <input type="radio" name="theme" value="light">
              <span class="theme-preview light-theme"></span>
              <span>Light</span>
            </label>
            <label class="theme-option">
              <input type="radio" name="theme" value="auto">
              <span class="theme-preview auto-theme"></span>
              <span>Auto</span>
            </label>
          </div>
        </div>
        
        <div class="preference-item">
          <div class="preference-info">
            <h4>Transaction Settings</h4>
            <p>Default gas settings and confirmations</p>
          </div>
          <button id="transactionSettingsBtn" class="btn btn-secondary">Configure</button>
        </div>
        
        <div class="preference-item">
          <div class="preference-info">
            <h4>Language</h4>
            <p>Interface language</p>
          </div>
          <div class="preference-control">
            <select id="languageSelect" class="form-select">
              <option value="en" selected>English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Wallet Management -->
    <div class="settings-section">
      <h2 class="section-title">Wallet Management</h2>
      <div class="settings-card">
        <div class="wallet-management">
          <div class="wallets-list">
            <h4>Your Wallets</h4>
            <div id="walletsContainer" class="wallets-container">
              <!-- Wallets will be loaded dynamically -->
              <div class="empty-wallets">
                <p>No additional wallets found</p>
              </div>
            </div>
          </div>
          
          <div class="wallet-actions">
            <button id="addWalletBtn" class="btn btn-primary">➕ Add Wallet</button>
            <button id="importWalletBtn" class="btn btn-secondary">📤 Import Wallet</button>
          </div>
        </div>
        
        <div class="wallet-tools">
          <button id="addressBookBtn" class="btn btn-secondary">Address Book</button>
          <button id="tokenManagementBtn" class="btn btn-secondary">Manage Tokens</button>
          <button id="connectedSitesBtn" class="btn btn-secondary">Connected Sites</button>
        </div>
      </div>
    </div>
    
    <!-- Advanced & Developer -->
    <div class="settings-section">
      <h2 class="section-title">Advanced</h2>
      <div class="settings-card">
        <div class="advanced-item">
          <div class="advanced-info">
            <h4>Developer Mode</h4>
            <p>Enable developer features and tools</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="developerToggle">
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div id="developerOptions" class="developer-options" style="display: none;">
          <div class="dev-item">
            <button id="resetAccountBtn" class="btn btn-secondary">Reset Account</button>
            <p class="dev-hint">Clears transaction history and resyncs</p>
          </div>
          
          <div class="dev-item">
            <button id="customRPCBtn" class="btn btn-secondary">Custom RPC</button>
            <p class="dev-hint">Add custom network endpoints</p>
          </div>
          
          <div class="dev-item">
            <button id="stateLogsBtn" class="btn btn-secondary">State Logs</button>
            <p class="dev-hint">View application state for debugging</p>
          </div>
          
          <div class="dev-item">
            <button id="clearCacheBtn" class="btn btn-secondary">Clear Cache</button>
            <p class="dev-hint">Clear all cached data</p>
          </div>
        </div>
        
        <div class="advanced-item">
          <div class="advanced-info">
            <h4>Privacy Settings</h4>
            <p>Control analytics and data collection</p>
          </div>
          <button id="privacySettingsBtn" class="btn btn-secondary">Configure</button>
        </div>
        
        <div class="advanced-item">
          <div class="advanced-info">
            <h4>Export All Data</h4>
            <p>Download all your wallet data</p>
          </div>
          <button id="exportAllDataBtn" class="btn btn-secondary">Export</button>
        </div>
      </div>
    </div>
    
    <!-- Danger Zone -->
    <div class="settings-section danger-zone">
      <h2 class="section-title">⚠️ Danger Zone</h2>
      <div class="settings-card danger-card">
        <div class="danger-item">
          <div class="danger-info">
            <h4>🔐 Lock Wallet</h4>
            <p>Lock your wallet and clear session data</p>
          </div>
          <button id="lockWalletBtn" class="btn btn-warning">Lock Wallet</button>
        </div>
        
        <div class="danger-item">
          <div class="danger-info">
            <h4>🗑️ Remove This Wallet</h4>
            <p>Remove this wallet from this device. You'll need your seed phrase to restore.</p>
          </div>
          <button id="removeThisWalletBtn" class="btn btn-danger">Remove Wallet</button>
        </div>
        
        <div class="danger-item">
          <div class="danger-info">
            <h4>💣 Reset Everything</h4>
            <p>Clear ALL data including all wallets and settings</p>
          </div>
          <button id="resetEverythingBtn" class="btn btn-danger">Factory Reset</button>
        </div>
      </div>
    </div>
    
    <!-- About & Support -->
    <div class="settings-section">
      <h2 class="section-title">ℹ️ About & Support</h2>
      <div class="settings-card">
        <div class="about-info">
          <div class="app-info">
            <h3>My Crypto Wallet</h3>
            <p class="version" id="appVersion">Version 1.0.0</p>
            <p class="build" id="buildInfo">Build #12345 • Last updated: Jan 15, 2024</p>
          </div>
          
          <div class="support-links">
            <a href="#" class="support-link">📖 User Guide</a>
            <a href="#" class="support-link">🐛 Report Bug</a>
            <a href="#" class="support-link">💡 Feature Request</a>
            <a href="#" class="support-link">🔒 Privacy Policy</a>
            <a href="#" class="support-link">📄 Terms of Service</a>
          </div>
          
          <div class="external-links">
            <a href="https://github.com" target="_blank" class="external-link">🐙 GitHub</a>
            <a href="https://twitter.com" target="_blank" class="external-link">🐦 Twitter</a>
            <a href="https://discord.com" target="_blank" class="external-link">💬 Discord</a>
          </div>
          
          <div class="credits">
            <p>Built with ❤️ using <strong>ethers.js</strong> and <strong>Vite</strong></p>
            <p class="copyright">© 2024 My Crypto Wallet. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Modals -->
<div id="changePasswordModal" class="modal" style="display: none;">
  <div class="modal-content">
    <div class="modal-header">
      <h3>🔐 Change Password</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <form id="passwordForm" class="modal-form">
        <div class="form-group">
          <label for="currentPassword">Current Password</label>
          <input type="password" id="currentPassword" required class="form-input">
        </div>
        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input type="password" id="newPassword" required class="form-input" minlength="8">
          <div class="password-strength" id="newPasswordStrength"></div>
        </div>
        <div class="form-group">
          <label for="confirmNewPassword">Confirm New Password</label>
          <input type="password" id="confirmNewPassword" required class="form-input">
          <div class="password-match" id="newPasswordMatch"></div>
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn btn-primary">Change Password</button>
          <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div id="seedPhraseModal" class="modal" style="display: none;">
  <div class="modal-content">
    <div class="modal-header">
      <h3>🔒 Your Secret Recovery Phrase</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <div class="warning-banner">
        <p><strong>⚠️ WARNING: Never share this phrase!</strong></p>
        <p>Anyone with these words can steal your assets.</p>
      </div>
      <div class="seed-phrase-display" id="seedPhraseDisplay">
        <!-- Seed phrase will be inserted here -->
      </div>
      <div class="modal-actions">
        <button id="copySeedBtn" class="btn btn-secondary">📋 Copy to Clipboard</button>
        <button id="hideSeedBtn" class="btn btn-primary">I've Saved It</button>
      </div>
    </div>
  </div>
</div>

<div id="confirmModal" class="modal" style="display: none;">
  <div class="modal-content">
    <div class="modal-header">
      <h3 id="confirmTitle">Confirm Action</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <p id="confirmMessage">Are you sure you want to proceed?</p>
      <div class="modal-actions">
        <button id="confirmActionBtn" class="btn btn-danger">Confirm</button>
        <button id="cancelActionBtn" class="btn btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
</div>

    <!-- Lock Screen Overlay -->
<div id="lock-overlay" class="lock-overlay" style="display: none;">
  <div class="lock-modal">
    <h2>🔒 Wallet Locked</h2>
    <p>Enter your password or private key to unlock.</p>

    <form class="lock-form">
      <div class="form-group">
        <label for="unlockPassword">Password</label>
        <input
          type="password"
          id="unlockPassword"
          placeholder="Enter your password"
        />
      </div>
      </div>

      <button id="unlockWallet" class="btn btn-primary btn-large">
        Unlock Wallet
      </button>
    </form>
  </div>
</div>`,
 init: async () => {
    console.log('SettingsPage loaded');
    const { initSettingsPage } = await import('./settings.js');
    initSettingsPage();
  }

}

export const ImportPage = {
  template: `
  <head>
   <link rel="stylesheet" href="/src/CSS/import.css">
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
      <button id="toggleSeedPhrase" class="mode-btn active">Import Seed Phrase</button>
      <button id="togglePK" class="mode-btn">Import Private Key</button>
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

export const SendingPage = {
  template: `
    <head>
   <link rel="stylesheet" href="/src/CSS/sending.css">
   </head>
  <div class="send-page">
  <nav class="send-nav">
    <div class="nav-back">
      <a href="/dashboard" data-route class="back-link">← Back to Dashboard</a>
    </div>
    <h1 class="page-title">📤 Send</h1>
  </nav>
  
  <div class="send-container">
    <!-- Quick Actions -->
    <div class="quick-actions">
      <button class="quick-action-btn" id="addressBookBtn">
        📒 Address Book
      </button>
      <button class="quick-action-btn" id="recentRecipientsBtn">
        ⏱️ Recent
      </button>
    </div>
    
    <!-- Main Send Form -->
    <form id="sendForm" class="send-form">
      <!-- From Account Selection -->
      <div class="form-section">
        <h3 class="section-title">From Account</h3>
        <div class="from-account-selector">
          <div class="account-dropdown">
            <select id="fromAccount" class="form-select" required>
              <option value="" disabled selected>Select sending account...</option>
              <!-- Accounts will be populated dynamically -->
            </select>
            <div class="account-balance" id="selectedBalance">Balance: --</div>
          </div>
          
          <div class="account-details" id="accountDetails" style="display: none;">
            <div class="detail-row">
              <span>Address:</span>
              <span id="detailAddress" class="monospace"></span>
            </div>
            <div class="detail-row">
              <span>Network:</span>
              <span id="detailNetwork">Ethereum Mainnet</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recipient Section -->
      <div class="form-section">
        <h3 class="section-title">
          <span>To Recipient</span>
          <span class="section-subtitle">Enter address, ENS name, or select from contacts</span>
        </h3>
        
        <div class="recipient-input-container">
          <div class="input-with-validation">
            <input 
              type="text" 
              id="toAddress" 
              placeholder="0x... or name.eth"
              required
              class="form-input large"
              autocomplete="off"
            >
            <div class="input-actions">
              <button type="button" id="clearAddressBtn" class="btn-small">✕</button>
            </div>
          </div>
          
          <div class="validation-feedback" id="addressValidation">
            <div class="validation-icon"></div>
            <span class="validation-text">Enter a valid Ethereum address or ENS name</span>
          </div>
          
          <!-- ENS Resolution -->
          <div id="ensResolution" class="ens-resolution" style="display: none;">
            <div class="ens-resolved">
              <span class="ens-name" id="ensName"></span>
              <span class="ens-address" id="resolvedAddress"></span>
              <span class="ens-check">✅</span>
            </div>
          </div>
          
          <!-- Recipient Preview -->
          <div id="recipientPreview" class="recipient-preview" style="display: none;">
            <div class="preview-header">
              <span class="preview-label">Sending to:</span>
              <button type="button" id="editRecipientBtn" class="btn-small">Edit</button>
            </div>
            <div class="preview-content">
              <div class="preview-avatar">👤</div>
              <div class="preview-info">
                <strong id="previewName">Unknown</strong>
                <small id="previewAddress" class="monospace"></small>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Amount Section -->
      <div class="form-section">
        <h3 class="section-title">Amount</h3>
        
        <div class="amount-input-container">
          <div class="amount-input-group">
            <input 
              type="number" 
              id="amount" 
              step="0.000001"
              min="0.000001"
              placeholder="0.00"
              required
              class="amount-input"
            >
            <div class="currency-selector">
              <select id="currency" class="currency-select">
                <option value="ETH">ETH</option>
                <option value="DAI">DAI</option>
                <option value="USDC">USDC</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
          </div>
          
          <div class="amount-actions">
            <button type="button" class="amount-btn" data-percent="25">25%</button>
            <button type="button" class="amount-btn" data-percent="50">50%</button>
            <button type="button" class="amount-btn" data-percent="75">75%</button>
            <button type="button" class="amount-btn" data-percent="100">MAX</button>
          </div>
          
          <div class="fiat-conversion">
            <span id="fiatValue">≈ $0.00</span>
            <span class="exchange-rate" id="exchangeRate">1 ETH = $0.00</span>
          </div>
        </div>
        
        <!-- Balance Information -->
        <div class="balance-info">
          <div class="balance-row">
            <span>Available:</span>
            <span id="availableBalance">-- ETH</span>
          </div>
          <div class="balance-row">
            <span>Remaining after send:</span>
            <span id="remainingBalance">-- ETH</span>
          </div>
          <div class="balance-row warning" id="insufficientWarning" style="display: none;">
            <span>⚠️ Insufficient balance</span>
          </div>
        </div>
      </div>
      
      <!-- Advanced Options (Collapsible) -->
      <div class="form-section advanced-section">
        <div class="advanced-header">
          <h3 class="section-title">
            ⚙️ Advanced Options
          </h3>
          <button type="button" id="toggleAdvanced" class="btn-small">
            Show
          </button>
        </div>
        
        <div id="advancedOptions" class="advanced-options" style="display: none;">
          <!-- Gas Settings -->
          <div class="advanced-group">
            <h4>Gas Settings</h4>
            <div class="gas-options">
              <div class="gas-option">
                <input type="radio" id="gasAuto" name="gasMode" value="auto" checked>
                <label for="gasAuto">
                  <span class="gas-option-title">⚡ Auto (Recommended)</span>
                  <span class="gas-option-desc">Optimal speed and cost</span>
                </label>
              </div>
              
              <div class="gas-option">
                <input type="radio" id="gasManual" name="gasMode" value="manual">
                <label for="gasManual">
                  <span class="gas-option-title">🛠️ Manual</span>
                  <span class="gas-option-desc">Set custom gas parameters</span>
                </label>
              </div>
            </div>
            
            <!-- Manual Gas Controls -->
            <div id="manualGasControls" class="manual-gas-controls" style="display: none;">
              <div class="gas-input-group">
                <div class="gas-input">
                  <label for="gasLimit">Gas Limit</label>
                  <input type="number" id="gasLimit" value="21000" min="21000" class="form-input">
                  <div class="gas-hint">Standard transfer: 21,000 gas</div>
                </div>
                
                <div class="gas-input">
                  <label for="gasPrice">Gas Price (Gwei)</label>
                  <input type="number" id="gasPrice" step="0.1" min="1" class="form-input">
                  <div class="gas-hint" id="gasPriceHint">Current: -- Gwei</div>
                </div>
                
                <div class="gas-input">
                  <label for="maxFee">Max Fee (Gwei)</label>
                  <input type="number" id="maxFee" step="0.1" min="1" class="form-input">
                  <div class="gas-hint">For EIP-1559 transactions</div>
                </div>
                
                <div class="gas-input">
                  <label for="priorityFee">Priority Fee (Gwei)</label>
                  <input type="number" id="priorityFee" step="0.1" min="0" class="form-input">
                  <div class="gas-hint">Tip for faster inclusion</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Transaction Data -->
          <div class="advanced-group">
            <h4>Transaction Data (Hex)</h4>
            <textarea 
              id="transactionData" 
              placeholder="0x..."
              class="data-input"
              rows="3"
            ></textarea>
            <div class="data-hint">
              For contract interactions. Leave empty for simple transfers.
            </div>
          </div>
          
          <!-- Nonce -->
          <div class="advanced-group">
            <div class="nonce-control">
              <label for="nonce">Nonce</label>
              <div class="nonce-input-group">
                <input 
                  type="number" 
                  id="nonce" 
                  min="0"
                  class="form-input"
                  placeholder="Auto"
                >
                <button type="button" id="fetchNonceBtn" class="btn-small">
                  Get Current
                </button>
              </div>
              <div class="nonce-hint">
                Leave empty for automatic nonce assignment
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Transaction Summary -->
      <div class="transaction-summary" id="transactionSummary" style="display: none;">
        <h3 class="summary-title">📋 Transaction Summary</h3>
        
        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">From</span>
            <span class="summary-value monospace" id="summaryFrom"></span>
          </div>
          
          <div class="summary-item">
            <span class="summary-label">To</span>
            <span class="summary-value monospace" id="summaryTo"></span>
          </div>
          
          <div class="summary-item">
            <span class="summary-label">Amount</span>
            <span class="summary-value" id="summaryAmount"></span>
          </div>
          
          <div class="summary-item">
            <span class="summary-label">Network Fee</span>
            <span class="summary-value" id="summaryFee"></span>
          </div>
          
          <div class="summary-item total">
            <span class="summary-label">Total Cost</span>
            <span class="summary-value" id="summaryTotal"></span>
          </div>
          
          <div class="summary-item">
            <span class="summary-label">Estimated Time</span>
            <span class="summary-value" id="summaryTime">~15 seconds</span>
          </div>
        </div>
      </div>

      <!-- Inline Transaction Preview -->
<div id="inlinePreview" class="inline-preview" style="display: none;">
  <h3 class="preview-title">👁️ Transaction Preview</h3>

  <div class="preview-grid">
    <div class="preview-item">
      <span class="preview-label">From</span>
      <span class="preview-value monospace" id="inlineFrom"></span>
    </div>

    <div class="preview-item">
      <span class="preview-label">To</span>
      <span class="preview-value monospace" id="inlineTo"></span>
    </div>

    <div class="preview-item">
      <span class="preview-label">Amount</span>
      <span class="preview-value" id="inlineAmount"></span>
    </div>

    <div class="preview-item">
      <span class="preview-label">Network Fee</span>
      <span class="preview-value" id="inlineFee"></span>
    </div>

    <div class="preview-item total">
      <span class="preview-label">Total Cost</span>
      <span class="preview-value" id="inlineTotal"></span>
    </div>
  </div>

  <div class="preview-warning-inline">
    ⚠️ Review carefully — transactions cannot be reversed.
  </div>
</div>

      
      <!-- Submit Section -->
      <div class="submit-section">
        <div class="submit-actions">
          <button type="button" id="previewBtn" class="btn btn-secondary">
            👁️ Preview
          </button>
          <button type="submit" id="sendBtn" class="btn btn-primary" >
            Send Transaction
          </button>
        </div>
        
        <div class="security-notice">
          <div class="notice-icon">🔒</div>
          <div class="notice-content">
            <p><strong>Transaction will be signed locally</strong></p>
            <p>Your private key never leaves this device.</p>
          </div>
        </div>
      </div>
    </form>
    
    <!-- Loading State -->
    <div id="loadingState" class="loading-state" style="display: none;">
      <div class="loading-spinner"></div>
      <h3 id="loadingTitle">Processing Transaction</h3>
      <p id="loadingMessage">Please wait while we prepare your transaction...</p>
      <div class="loading-progress">
        <div class="progress-bar">
          <div class="progress-fill" id="progressFill"></div>
        </div>
        <span id="progressText">0%</span>
      </div>
    </div>
    
    <!-- Transaction Status -->
    <div id="transactionStatus" class="transaction-status" style="display: none;">
      <div class="status-icon" id="statusIcon">⏳</div>
      <h3 id="statusTitle">Transaction Submitted</h3>
      <p id="statusMessage">Your transaction has been broadcast to the network.</p>
      <div class="transaction-hash">
        <span class="hash-label">Transaction Hash:</span>
        <span class="hash-value monospace" id="txHash"></span>
        <button id="copyHashBtn" class="btn-small">📋</button>
      </div>
      <div class="status-actions">
        <a href="#" target="_blank" id="viewExplorerBtn" class="btn btn-secondary">
          🔍 View on Explorer
        </a>
        <button id="newTransactionBtn" class="btn btn-primary">
          📤 New Transaction
        </button>
      </div>
    </div>
    
    <!-- Error Display -->
    <div id="errorDisplay" class="error-display" style="display: none;">
      <div class="error-icon">❌</div>
      <div class="error-content">
        <h4 id="errorTitle">Transaction Failed</h4>
        <p id="errorMessage"></p>
        <div class="error-actions">
          <button id="retryBtn" class="btn btn-primary">Retry</button>
          <button id="dismissErrorBtn" class="btn btn-secondary">Dismiss</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Address Book Modal -->
<div id="addressBookModal" class="modal" style="display: none;">
  <div class="modal-content">
    <div class="modal-header">
      <h3>📒 Address Book</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <div class="address-book-search">
        <input type="text" placeholder="Search contacts..." class="search-input">
        <button class="btn-small">🔍</button>
      </div>
      
      <div class="address-book-list" id="addressBookList">
        <!-- Contacts will be populated here -->
        <div class="empty-contacts">
          <p>No contacts saved yet.</p>
          <button id="addContactBtn" class="btn btn-secondary">Add Contact</button>
        </div>
      </div>
      
      <div class="modal-actions">
        <button id="selectContactBtn" class="btn btn-primary" disabled>Select</button>
        <button class="btn btn-secondary modal-close">Cancel</button>
      </div>
    </div>
  </div>
</div>

<!-- Preview Modal -->
<div id="previewModal" class="modal" style="display: none;">
  <div class="modal-content">
    <div class="modal-header">
      <h3>👁️ Transaction Preview</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <div class="preview-details">
        <div class="preview-row">
          <span>From:</span>
          <strong class="monospace" id="previewFrom"></strong>
        </div>
        <div class="preview-row">
          <span>To:</span>
          <strong class="monospace" id="previewTo"></strong>
        </div>
        <div class="preview-row">
          <span>Amount:</span>
          <strong id="previewAmount"></strong>
        </div>
        <div class="preview-row">
          <span>Network Fee:</span>
          <strong id="previewFee"></strong>
        </div>
        <div class="preview-row total">
          <span>Total:</span>
          <strong id="previewTotal"></strong>
        </div>
      </div>
      
      <div class="preview-warning">
        <p>⚠️ <strong>Review carefully before sending</strong></p>
        <p>Transactions cannot be reversed once confirmed.</p>
      </div>
      
      <div class="modal-actions">
        <button id="confirmSendBtn" class="btn btn-primary">✅ Confirm & Send</button>
        <button class="btn btn-secondary modal-close">✕ Cancel</button>
      </div>
    </div>
  </div>
</div>
`, 
 init: async () => {
    console.log('SendingPage loaded');
    const { initSendingPage } = await import('./sending.js');
    initSendingPage();
  }
}