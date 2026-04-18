// ==UserScript==
// @name         Camsoda: Extra Links
// @namespace    zcb_dev
// @version      1.2
// @description  Adds quick links to NRTool and CGF on Camsoda model profile pages for easier navigation
// @author       zcb22
// @match        https://*.camsoda.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=camsoda.com
// ==/UserScript==

(function () {
    'use strict';

    // Domain guard for master-script compatibility
    if (!location.hostname.includes('camsoda.com')) return;

    // Link generators
    const TOOLS = {
        'NRTOOL': (n) => `https://nrtool.to/nrtool/history/cs/${n}`,
        'CGF':    (n) => `https://camgirlfinder.net/models/cs/${n}#1`
    };

	let activeModel = '';
	
    /**
     * Main UI Synchronization logic
     */
    const syncUI = () => {
        const nav = document.querySelector('[class*="index-module__headerBottom"]');
        const player = document.querySelector('[class*="index-module__mobileVideoPanelWrapper"]') ||
                           document.querySelector('[class*="index-module__score"]');
						   
		if (!nav) return;

        // Extract model name only if we are on a profile page with an active player
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const modelName = (player)
        ? pathParts[0]
        : '';

        // Prevent unnecessary DOM updates
        if (modelName === activeModel) return;
        activeModel = modelName;
		
		// Cleanup previous injected links
        nav.querySelectorAll('.cs-ext-item').forEach(el => el.remove());

        // Inject links
		if (modelName && nav) {
			let html = '';
			for (const label in TOOLS) {
				html += `
					<a href="${TOOLS[label](modelName)}" target="_blank" rel="noopener noreferrer" style="color: #fff">
                        <div class="index-module__headerBottomBox--EtHub cs-ext-item">
							${label}
						</div>
					</a>`;
			}
			nav.insertAdjacentHTML('afterbegin', html);
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