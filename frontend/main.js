// frontend/main.js
import { Router } from '/src/JS/router.js';
import { HomePage, CreateWalletPage, DashboardPage, SettingsPage, SendingPage, ImportPage, LockedPage } from '/src/JS/index.js';
import {NETWORKS} from '/src/JS/config.js'  ;



const router = new Router();

// Define available routes
router.route('/', HomePage);
router.route('/create', CreateWalletPage);
router.route('/dashboard', DashboardPage);
router.route('/import' , ImportPage);
router.route('/settings', SettingsPage);
router.route('/send', SendingPage);
router.route('/locked', LockedPage);

// Simple 404 fallback
const NotFoundPage = {
    template: `<div style="padding:40px;text-align:center;"><h2>Page not found</h2><p>The page you requested does not exist.</p></div>`
};
router.route('/404', NotFoundPage);





//const networkKey = await window.sUtils.getNetwork();
//const network = NETWORKS[networkKey];
//const provider = new ethers.JsonRpcProvider(network.rpcUrl);
//window.provider = provider;
//
let worker = new Worker(new URL("./src/Workers/Worker", import.meta.url), { type: "module" });
window.worker = worker;
let msgId = 0;
const pending = new Map();

worker.onmessage = (event) => {
  const { id, type, payload } = event.data;
  const resolver = pending.get(id);
  if (!resolver) return;
  pending.delete(id);

  if (type === "ERROR") resolver.reject(payload);
  else resolver.resolve({ type, payload });
};




window.addEventListener('load', async () => {
    // Terminate old worker if exists
    if (window.worker) {
        window.worker.terminate();
    }
    
    // Create new worker
    window.worker = new Worker('/src/Workers/Worker.js', { type: 'module' });
    worker = window.worker;
    // Wait for worker to be ready
    await new Promise((resolve) => {
        const listener = (e) => {
            if (e.data.type === 'INIT_OK') {
                window.worker.removeEventListener('message', listener);
                resolve();
            }
        };
        window.worker.addEventListener('message', listener);
        window.worker.postMessage({ id: 'init', type: 'INIT' });
    });
    
    console.log('Worker ready after reload');
});

export function sendToWorker(type, payload = {}) {
  return new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    worker.postMessage({ id, type, payload });
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
router.init();
window.router = router;
sendToWorker("INIT", { rpcUrl: NETWORKS.localhost.rpcUrl }); // Default to localhost, can be changed in settings

