

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

export const SettingsPage ={
    template:`
      <head>
  <link rel="stylesheet" href="/src/settings.css">
  </head>
     <div class="settings-page"> 
  <nav class="settings-nav">
    <div class="nav-back">
      <a href="/dashboard" data-route class="back-link">← Back to Dashboard</a>
    </div>
    <h1 class="page-title">⚙️ Settings</h1>
  </nav>
  
  <div class="settings-container">
    <!-- Profile Section -->
    <div class="settings-section">
      <h2 class="section-title">👤 Profile</h2>
      <div class="settings-card">
        <div class="profile-info">
          <div class="profile-avatar">
            <div class="avatar-icon">👤</div>
            <button class="change-avatar-btn">Change</button>
          </div>
          <div class="profile-details">
            <h3 id="profileName">My Wallet</h3>
            <div class="wallet-address-display">
              <span id="currentWalletAddress">0x0000...0000</span>
              <button id="copyAddressBtn" class="btn-small">📋 Copy</button>
            </div>
            <div class="profile-meta">
              <span class="meta-item">🔗 Network: <span id="currentNetwork">Sepolia</span></span>
            </div>
          </div>
        </div>
        
        <div class="profile-actions">
          <button id="editProfileBtn" class="btn btn-secondary">Edit Profile</button>
          <button id="exportProfileBtn" class="btn btn-secondary">Export Profile</button>
        </div>
      </div>
    </div>
    
    <!-- Security Section -->
    <div class="settings-section">
      <h2 class="section-title">🔒 Security</h2>
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
            <button id="viewSeedBtn" class="btn btn-secondary">View Seed Phrase</button>
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
      <h2 class="section-title">🌐 Network & Preferences</h2>
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
              <option value="goerli">Goerli Testnet</option>
              <option value="polygon">Polygon Mainnet</option>
              <option value="arbitrum">Arbitrum One</option>
              <option value="optimism">Optimism</option>
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
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Wallet Management -->
    <div class="settings-section">
      <h2 class="section-title">👛 Wallet Management</h2>
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
          <button id="addressBookBtn" class="btn btn-secondary">📒 Address Book</button>
          <button id="tokenManagementBtn" class="btn btn-secondary">💰 Manage Tokens</button>
          <button id="connectedSitesBtn" class="btn btn-secondary">🔗 Connected Sites</button>
        </div>
      </div>
    </div>
    
    <!-- Advanced & Developer -->
    <div class="settings-section">
      <h2 class="section-title">🛠️ Advanced</h2>
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