// ==UserScript==
// @name         BongaCams: Extra Links
// @namespace    zcb_dev
// @version      1.0
// @description  Adds quick links to NRTool and CGF on BongaCams model profile pages for easier navigation
// @author       zcb22
// @match        https://*.bongacams.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bongacams.com
// ==/UserScript==

(function () {
    'use strict';

    // Domain guard for master-script compatibility
    if (!location.hostname.includes('bongacams.com')) return;

    // Link generators
    const TOOLS = {
        'NRTool': (n) => `https://nrtool.to/nrtool/search?site=bc&s=${n}`,
        'CGF':    (n) => `https://camgirlfinder.net/models/bc/${n}#1`
    };

    let activeModel = '';

    /**
     * Main UI Synchronization logic
     */
    const syncUI = () => {
        const nav = document.querySelector('#chatContainer > div.bc_chat_header > div:nth-child(2)');
        const player = document.querySelector('body.chat_visible');

        if (!nav || !player) return;

        // Extract model name only if we are on a profile page with an active player
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const modelName = (player)
        ? pathParts[0]
        : '';

        // Prevent unnecessary DOM updates
        if (modelName === activeModel && nav.querySelector('.bc-ext-item')) return;
        activeModel = modelName;

        // Cleanup previous injected links
        nav.querySelectorAll('.bc-ext-item').forEach(el => el.remove());

        // Inject links
        if (modelName && nav) {
            let html = '';
            for (const label in TOOLS) {
                html += `
					<a class="bc_chat_button ch_button bc-ext-item" href="${TOOLS[label](modelName)}" target="_blank" rel="noopener noreferrer">
						<span class="cb_inner">${label}</span>
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
            timer = setTimeout(syncUI, 250);
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