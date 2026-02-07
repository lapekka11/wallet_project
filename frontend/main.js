// frontend/main.js
import { Router } from '/src/JS/router.js';
import { HomePage, CreateWalletPage, DashboardPage, SettingsPage, SendingPage, ImportPage, LockedPage } from '/src/JS/index.js';
import { NETWORKS } from '/src/JS/config.js';

const router = new Router();

// Define available routes
router.route('/', HomePage);
router.route('/create', CreateWalletPage);
router.route('/dashboard', DashboardPage);
router.route('/import', ImportPage);
router.route('/settings', SettingsPage);
router.route('/send', SendingPage);
router.route('/locked', LockedPage);

// Simple 404 fallback
const NotFoundPage = {
    template: `<div style="padding:40px;text-align:center;"><h2>Page not found</h2><p>The page you requested does not exist.</p></div>`
};
router.route('/404', NotFoundPage);

// Worker initialization
let worker = null;
let msgId = 0;
const pending = new Map();

async function initWorker() {
    if (worker) {
        worker.terminate();
        pending.clear(); // Clear any pending promises
    }
    
    // Create worker with correct path
    worker = new Worker(new URL('./src/Workers/Worker.js', import.meta.url), { 
        type: 'module' 
    });
    
    // Set up message handler
    worker.onmessage = (event) => {
        const { id, type, payload } = event.data;
        const resolver = pending.get(id);
        
        if (!resolver) {
            console.warn('No resolver for message id:', id);
            return;
        }
        
        pending.delete(id);

        console.log('Worker message received:', { id, type });
        
        if (type === "ERROR") {
            console.error('Worker error:', payload);
            resolver.reject(payload);
        } else {
            resolver.resolve({ type, payload });
        }
    };
    
    // Wait for worker to be ready
    await new Promise((resolve, reject) => {
        const cleanup = () => {
            worker.removeEventListener('message', listener);
            clearTimeout(timeoutId);
        };
        
        const listener = (e) => {
            const { type, payload } = e.data;
            
            if (type === 'INIT_OK') {
                cleanup();
                console.log('Worker initialized successfully');
                resolve();
            } else if (type === 'ERROR') {
                cleanup();
                console.error('Worker initialization failed:', payload);
                reject(new Error(`Worker init failed: ${payload}`));
            }
        };
        
        const timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error('Worker initialization timeout'));
        }, 10000); // 10 second timeout for worker init
        
        worker.addEventListener('message', listener);
        worker.postMessage({ id: 'init', type: 'INIT' });
    });
}

// Initialize on page load
window.addEventListener('load', async () => {
    console.log('Page loaded, initializing worker...');
    
    try {
        // Initialize worker first
        await initWorker();
        
        // Initialize router
        router.init();
        window.router = router;
        
        // Send network initialization to worker
        console.log('Initializing worker with network...');
        const result = await sendToWorker("INIT", { rpcUrl: NETWORKS.localhost.rpcUrl });
        console.log('Worker network initialized:', result);
        
    } catch (error) {
        console.error('Failed to initialize:', error);
        // You might want to show an error to the user here
        alert('Failed to initialize application. Please refresh the page.');
    }
});

export function sendToWorker(type, payload = {}) {
    return new Promise((resolve, reject) => {
        if (!worker) {
            reject(new Error('Worker not initialized. Please wait for page to load.'));
            return;
        }
        
        const id = ++msgId;
        pending.set(id, { resolve, reject });
        
        console.log('Sending to worker:', { id, type, payload });
        
        try {
            worker.postMessage({ id, type, payload });
        } catch (error) {
            pending.delete(id);
            reject(new Error(`Failed to send message to worker: ${error.message}`));
            return;
        }
        
        // Add timeout to prevent hanging promises
        const timeoutId = setTimeout(() => {
            if (pending.has(id)) {
                pending.delete(id);
                reject(new Error(`Worker timeout for ${type}`));
            }
        }, 30000); // 30 second timeout
    });
}

export const walletAPI = {
    init: (rpcUrl) => sendToWorker("INIT", { rpcUrl }),
    unlock: (password) => sendToWorker("UNLOCK", { password }),
    lock: () => sendToWorker("LOCK"),
    getBalance: () => sendToWorker("GET_BALANCE"),
    getTransactions: () => sendToWorker("GET_TXS"),
    sendTransaction: (tx) => sendToWorker("SEND_TX", { tx })
};

// Make walletAPI available globally for debugging/development
window.walletAPI = walletAPI;