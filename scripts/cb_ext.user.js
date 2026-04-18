// ==UserScript==
// @name         Chaturbate: Extra Links
// @namespace    zcb_dev
// @version      1.1
// @description  Adds quick links to NRTool, CGF and RECU on Chaturbate model profile pages for easier navigation
// @author       zcb22
// @match        https://*.chaturbate.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// ==/UserScript==

(function () {
    'use strict';

    // Domain guard for master-script compatibility
    if (!location.hostname.includes('chaturbate.com')) return;

    // Link generators
    const TOOLS = {
        'NRTOOL': (n) => `https://nrtool.to/nrtool/history/cb/${n}`,
        'CGF':    (n) => `https://camgirlfinder.net/models/cb/${n}#1`,
        'RECU':   (n) => `https://recu.me/performer/${n}`
    };

    let activeModel = '';

    /**
     * Main UI Synchronization logic
     */
    const syncUI = () => {
        const nav = document.querySelector('#desktop-spa-header > div > nav:nth-child(3)');
        const player = document.querySelector('.playerTitleBar');

        if (!nav) return;

        // Extract model name only if we are on a profile page with an active player
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const modelName = (player && player.style.visibility !== 'hidden')
        ? pathParts[0]
        : '';

        // Prevent unnecessary DOM updates
        if (modelName === activeModel) return;
        activeModel = modelName;

        // Cleanup previous injected links
        nav.querySelectorAll('.cb-ext-item').forEach(el => el.remove());

        // Inject links
        if (modelName && nav) {
            let html = '';
            for (const label in TOOLS) {
                html += `
                    <a href="${TOOLS[label](modelName)}" target="_blank" rel="noopener noreferrer" class="HeaderNavBar__link cb-ext-item">
                            <div class="type--smpx type--medium textColor HeaderNavBar__link-text">
                                ${label}
                            </div>
                    </a>`;
            }
            nav.insertAdjacentHTML('beforeend', html);
        }
    };

    // Setup Observer
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