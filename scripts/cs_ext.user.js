// ==UserScript==
// @name         Camsoda: Extra Links
// @namespace    zcb_dev
// @version      1.0
// @description  Adds quick links to NRTool and CGF on Camsoda model profile pages for easier navigation
// @author       zcb22
// @match        https://*.camsoda.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=camsoda.com
// ==/UserScript==

(function () {
    'use strict';

    // Domain guard to prevent execution on other sites
    if (!location.hostname.includes('camsoda.com')) return;

    // External tool link generators
    const TOOLS = {
        'NRTOOL': (n) => `https://nrtool.to/nrtool/history/cs/${n}`,
        'CGF':    (n) => `https://camgirlfinder.net/models/cs/${n}#1`
    };

    /**
     * Injects custom CSS into the document head.
     * Styled in a vertical block for better maintainability.
     */
    const injectStyles = () => {
        if (document.getElementById('cs-ext-css')) return;
        const style = document.createElement('style');
        style.id = 'cs-ext-css';
        style.textContent = `
            .cs-ext-item {
                display: inline-flex;
                align-self: center;
                margin: 0 4px;
            }
            .cs-ext-item a {
                display: flex;
                align-items: center;
                height: 30px;
                padding: 0 12px;
                border-radius: 4px;
                background: #048ec9;
                color: #fff !important;
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
                text-decoration: none !important;
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: background 0.2s ease;
                white-space: nowrap;
            }
            .cs-ext-item a:hover {
                background: #0376a7 !important;
            }
        `;
        document.head.appendChild(style);
    };


	let activeModel = '';
    /**
     * Updates the UI by injecting or removing custom buttons based on the current page state.
     */
    const syncUI = () => {
        // Find the specific container in the model's header
        const headerBar = document.querySelector('[class*="index-module__headerBottom"]');

        // Check for model room indicators: video panel or the score/ranking element
        const isModelPage = document.querySelector('[class*="videoPanelWrapper"]') ||
                           document.querySelector('[class*="index-module__score"]');

        // Extract model name from the URL path
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const modelName = pathParts[0] || '';

        // If we are not in a model room, clean up and reset state
        if (!isModelPage || !modelName || !headerBar) {
            if (activeModel) {
                document.querySelectorAll('.cs-ext-item').forEach(el => el.remove());
                activeModel = '';
            }
            return;
        }

        // Avoid re-injection if the model is the same and buttons already exist
        if (modelName === activeModel && headerBar.querySelector('.cs-ext-item')) return;

        activeModel = modelName;

        // Clean up any existing custom buttons before injection
        headerBar.querySelectorAll('.cs-ext-item').forEach(el => el.remove());

        // Construct and insert the HTML for new buttons
        let html = '';
        for (const label in TOOLS) {
            html += `
                <span class="cs-ext-item">
                    <a href="${TOOLS[label](modelName)}" target="_blank" rel="noopener">
                        ${label}
                    </a>
                </span>`;
        }
        headerBar.insertAdjacentHTML('afterbegin', html);
    };

    // Initial style injection
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
    const targetNode = document.querySelector('[class*="index-module__headerBottom"]');;
    observer.observe(targetNode, {
        childList: true,
        subtree: true
    });
    // Run initial check
    syncUI();
})();