// ==UserScript==
// @name         Stripchat: Extra Links
// @namespace    zcb_dev
// @version      1.1
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
     * Main UI Synchronization logic
     */
    const syncUI = () => {
        const nav = document.querySelector('.nav-left');

		if (!nav) return;

        const modelName = document.querySelector('h1.viewcam-profile-menu-item__label')?.textContent?.trim();

        // Prevent unnecessary DOM updates
        if (modelName === activeModel) return;
        activeModel = modelName;

        // Cleanup previous injected links
        nav.querySelectorAll('.sc-ext-item').forEach(el => el.remove());

        // Inject links
        if (modelName && nav) {
            let html = '';
            for (const label in TOOLS) {
                html += `
					<div class="sc-ext-item nav-link">
						<a href="${TOOLS[label](modelName)}" target="_blank" rel="noopener noreferrer">
							${label}
						</a>
					</div>`;
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