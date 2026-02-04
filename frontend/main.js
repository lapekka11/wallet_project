// frontend/main.js
import { Router } from '/src/router.js';
import { HomePage, CreateWalletPage, DashboardPage } from '/src/index.js';
import {SecureStore} from '../storage_logic/SecureStore';


const router = new Router();

// Define available routes
router.route('/', HomePage);
router.route('/create', CreateWalletPage);
router.route('/dashboard', DashboardPage);

// Simple 404 fallback
const NotFoundPage = {
    template: `<div style="padding:40px;text-align:center;"><h2>Page not found</h2><p>The page you requested does not exist.</p></div>`
};
router.route('/404', NotFoundPage);
export let db = new SecureStore();
db.init();
window.db = db;
router.init();

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