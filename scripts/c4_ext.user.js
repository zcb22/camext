// ==UserScript==
// @name         Cam4: Extra Links
// @namespace    zcb_dev
// @version      1.0
// @description  Adds quick links to NRTool and CGF on Cam4 model profile pages for easier navigation
// @author       zcb22
// @match        https://*.cam4.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cam4.com
// ==/UserScript==

(function () {
    'use strict';

    // Domain check to ensure the script only runs on cam4.com
    if (!location.hostname.includes('cam4.com')) return;

    // Link generation configuration for external tools
    const TOOLS = {
        'NRTOOL': (n) => `https://nrtool.to/nrtool/history/cam4/${n}`,
        'CGF':    (n) => `https://camgirlfinder.net/models/c4/${n.toLowerCase()}#1`
    };

    /**
     * Injects custom CSS using Cam4 native variables for a seamless UI look.
     * Styles are organized vertically for better readability.
     */
    const injectStyles = () => {
        if (document.getElementById('c4-ext-css')) return;
        const style = document.createElement('style');
        style.id = 'c4-ext-css';
        style.textContent = `
            .c4-ext-item a {
                display: flex; 
                align-items: center; 
                height: calc(var(--v3-gridSize) * 5);
                padding: 0 calc(var(--v3-gridSize) * 1.5);
                background: var(--v3-color-button-menuItem-background);
                color: var(--v3-color-button-menuItem-label);
                border-right: 1px solid var(--v3-color-border);
                font-family: var(--v3-fontFamily); 
                font-size: var(--v3-typographyM-fontSize);
                font-weight: 500; 
                text-transform: uppercase; 
                text-decoration: none !important;
            }
            .c4-ext-item a:hover { 
                background: var(--v3-color-button-menuItem-background_hover); 
            }
        `;
        document.head.appendChild(style);
    };

    let activeModel = '';

    /**
     * Core function to detect the current model and inject links into the navigation menu.
     */
    const syncUI = () => {
        // Locate profile name and the target anchor (Explore button)
        const modelName = document.querySelector('[class*="index__profileName__"]')?.textContent?.trim();
        const anchor = document.querySelector('div[data-section-id="Explore"]');

        // Clean up and reset if not on a valid profile page
        if (!modelName || !anchor) {
            if (activeModel) { 
                document.querySelectorAll('.c4-ext-item').forEach(e => e.remove()); 
                activeModel = ''; 
            }
            return;
        }

        // Prevent redundant updates if model hasn't changed
        if (modelName === activeModel) return;
        activeModel = modelName;

        // Clear previous instances and inject new links
        document.querySelectorAll('.c4-ext-item').forEach(e => e.remove());
        
        let html = '';
        for (const label in TOOLS) {
            html += `<span class="c4-ext-item"><a href="${TOOLS[label](modelName)}" target="_blank" rel="noopener">${label}</a></span>`;
        }
        
        // Insert HTML after the parent of the anchor element
        anchor.parentElement?.insertAdjacentHTML('afterend', html);
    };

    // Run style injection once
    injectStyles();

    /**
     * Setup MutationObserver with a Debounce mechanism.
     * This protects the CPU from high-frequency DOM updates caused by React.
     */
    let timer;
    const observer = new MutationObserver((mutations) => {
        // Trigger sync only if structural changes (nodes added/removed) occur
        const hasChanges = mutations.some(m => m.addedNodes.length || m.removedNodes.length);
        if (hasChanges) {
            clearTimeout(timer);
            timer = setTimeout(syncUI, 200);
        }
    });
    // Start observing the document body for changes
    const targetNode = document.body;
    observer.observe(targetNode, {
        childList: true,
        subtree: true
    });
    // Run an initial check upon script execution
    syncUI();
})();