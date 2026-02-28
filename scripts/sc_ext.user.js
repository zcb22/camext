// ==UserScript==
// @name         Stripchat: Extra Links
// @namespace    zcb_dev
// @version      1.0
// @description  Adds quick links to NRTool and CGF on Stripchat model profile pages for easier navigation
// @author       zcb22
// @match        https://*.stripchat.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stripchat.com
// ==/UserScript==

(function () {
    'use strict';

    // Domain guard for master-script compatibility
    if (!location.hostname.includes('stripchat.com')) return;

    // Link generators
    const TOOLS = {
        'NRTOOL': (n) => `https://nrtool.to/nrtool/history/sc/${n}`,
        'CGF':    (n) => `https://camgirlfinder.net/models/sc/${n}#1`
    };

    let activeModel = '';

    /**
     * Injects custom CSS into the head
     * Formatted in blocks for better readability
     */
    const injectStyles = () => {
        if (document.getElementById('sc-ext-css')) return;
        const style = document.createElement('style');
        style.id = 'sc-ext-css';
        style.textContent = `
            .sc-ext-item {
                display: inline-flex;
                margin-right: 8px;
            }
            .sc-ext-item a {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 40px;
                padding: 0 20px;
                border-radius: 20px;
                border: 2px solid #fa5365;
                color: #fff !important;
                font-size: 14px;
                font-weight: 700;
                text-transform: uppercase;
                text-decoration: none !important;
                transition: background 0.2s ease, box-shadow 0.2s ease;
            }
            .sc-ext-item a:hover {
                background-color: #fa5365 !important;
                box-shadow: 0 4px 12px rgba(250, 83, 101, 0.3);
            }
        `;
        document.head.appendChild(style);
    };

    /**
     * Main logic to sync the UI with the current model
     */
    const syncUI = () => {	
		// If have no player menu = no model page. Drop
        const container = document.querySelector('.view-cam-buttons-wrapper');
		if (!container) return;
		
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const modelName = pathParts[0];

        // Exit if container is missing or links are already injected for this model
        if (modelName === activeModel && document.querySelector('.sc-ext-item')) return;
        activeModel = modelName;

        // Remove existing links to prevent duplicates during SPA navigation
        document.querySelectorAll('.sc-ext-item').forEach(el => el.remove());

        // Generate and inject new links
        let html = '';
        for (const label in TOOLS) {
            html += `
                <span class="sc-ext-item">
                    <a href="${TOOLS[label](modelName)}" 
						target="_blank" 
						rel="noopener">
                        ${label}
                    </a>
                </span>`;
        }
        container.insertAdjacentHTML('afterbegin', html);
    };

    // Initialize styles
    injectStyles();

    // Setup Observer with Debounce to protect against high-frequency React updates
    let timer;
    const observer = new MutationObserver((mutations) => {
        // Only trigger if nodes were actually added or removed
        const hasChanges = mutations.some(m => m.addedNodes.length || m.removedNodes.length);
        if (hasChanges) {
            clearTimeout(timer);
            timer = setTimeout(syncUI, 150);
        }
    });
    // Observing
    const targetNode = document.body;
    observer.observe(targetNode, {
        childList: true,
        subtree: true
    });
    // Run initial check
    syncUI();
})();