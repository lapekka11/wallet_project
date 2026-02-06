// frontend/main.js
import { Router } from '/src/JS/router.js';
import { HomePage, CreateWalletPage, DashboardPage, SettingsPage, SendingPage, ImportPage } from '/src/JS/index.js';
import {SecureStore} from '../storage_logic/SecureStore';
import{ethers} from 'ethers';
import { StorageUtils } from '../storage_logic/StorageUtile';


const router = new Router();

// Define available routes
router.route('/', HomePage);
router.route('/create', CreateWalletPage);
router.route('/dashboard', DashboardPage);
router.route('/import' , ImportPage);
router.route('/settings', SettingsPage);
router.route('/send', SendingPage);

// Simple 404 fallback
const NotFoundPage = {
    template: `<div style="padding:40px;text-align:center;"><h2>Page not found</h2><p>The page you requested does not exist.</p></div>`
};
router.route('/404', NotFoundPage);
export let sUtils =  new StorageUtils();
console.log(sUtils);
const x = await sUtils.init();
console.log(x);
window.sUtils = sUtils;
console.log(window.sUtils);


router.init();
window.provider =  new ethers.JsonRpcProvider("http://127.0.0.1:9545");
// Hook CTA button (use querySelector for multi-class selector)
const btn = document.querySelector('.btn.btn-primary.btn-large');
if (btn) {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        router.navigate('/create');
    });
}

// Make router available globally for navigation from anywhere
window.router = router;