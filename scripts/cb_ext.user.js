// ==UserScript==
// @name         Chaturbate: Extra Links
// @namespace    zcb_dev
// @version      1.0
// @description  Adds quick links to NRTool, CGF and RECU on Chaturbate model profile pages for easier navigation
// @author       zcb22
// @match        https://*.chaturbate.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// ==/UserScript==

(function () {
    'use strict';

    // Domain lock for Master-Script compatibility
    if (!location.hostname.includes('chaturbate.com')) return;

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
        const nav = document.getElementById('nav');
        const player = document.querySelector('.playerTitleBar');
        const canonical = document.querySelector('link[rel="canonical"]');

        // Extract model name only if we are on a profile page with an active player
        const modelName = (player && player.style.visibility !== 'hidden' && canonical)
            ? canonical.href.split('/').filter(Boolean).pop().toLowerCase()
            : '';

        // Prevent unnecessary DOM updates
        if (modelName === activeModel) return;
        activeModel = modelName;

        // Cleanup previous injected links
        document.querySelectorAll('.cb-ext-item').forEach(el => el.remove());

        // Inject links if on a model profile and nav menu exists
        if (modelName && nav) {
            let html = '';
            for (const label in TOOLS) {
                html += `
                    <li class="cb-ext-item">
                        <a href="${TOOLS[label](modelName)}" target="_blank" rel="noopener">
                            ${label}
                        </a>
                    </li>`;
            }
            // Appending to the end of the #nav list
            nav.insertAdjacentHTML('beforeend', html);
        }
    };

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