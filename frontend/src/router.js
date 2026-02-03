import {initWalletCreation} from './createWallet.js';

 import {initDashboard} from './dashboard.js';

export class Router {
  constructor() {
    this.routes = {};
    this.currentPath = '';
    this.appContainer = document.getElementById('app');
  }
  
  init() {
    // Listen for back/forward buttons
    window.addEventListener('popstate', () => this.handleRoute());
    
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-route]');
      if (link) {
        e.preventDefault();
        this.navigate(link.getAttribute('href'));
      }
    });
    
    // Handle initial load
    this.handleRoute();
  }
  
  // Define routes
  route(path, component) {
    this.routes[path] = component;
  }
  
  // Navigate to a path
  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }
  
  // Handle the current route
  async handleRoute() {
    const path = window.location.pathname;
    
    // Prevent re-rendering same path
    if (path === this.currentPath) return;
    this.currentPath = path;
    
    // Find matching route
    const route = this.routes[path] || this.routes['/404'];
    
    if (route) {
      // Clear current view
      this.appContainer.innerHTML = '';
      
      // Render the component
      await this.renderComponent(route);
    }
  }
  
  async renderComponent(component) {
    if (typeof component === 'function') {
      // If it's a component function, call it
      this.appContainer.innerHTML = component();
      await this.initializePageScripts();
    } else if (typeof component === 'string') {
      // If it's HTML string, insert it
      this.appContainer.innerHTML = component;
    } else if (component.template) {
      // If it's an object with template and init
      this.appContainer.innerHTML = component.template;
      if (component.init) {
        await component.init();
      }
    }
  }
  
  async initializePageScripts() {
    // Dynamically import page-specific JS based on current route
    switch(this.currentPath) {
      case '/create':
        initWalletCreation();
        break;
      case '/dashboard':
       
        initDashboard();
        break;
      // ... other routes
    }
  }
}