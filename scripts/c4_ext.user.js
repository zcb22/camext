// ==UserScript==
// @name         Cam4: Extra Links
// @namespace    zcb_dev
// @version      1.2
// @description  Adds quick links to NRTool and CGF on Cam4 model profile pages for easier navigation
// @author       zcb22
// @match        https://*.cam4.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cam4.com
// ==/UserScript==

(function () {
    'use strict';

    // Domain guard for master-script compatibility
    if (!location.hostname.includes('cam4.com')) return;

    // Link generators
    const TOOLS = {
        'NRTOOL': (n) => `https://nrtool.to/nrtool/history/cam4/${n}`,
        'CGF':    (n) => `https://camgirlfinder.net/models/c4/${n}#1`
    };

    let activeModel = '';

    /**
     * Main UI Synchronization logic
     */
    const syncUI = () => {
		const nav = document.querySelector('.rsdM3.AyoJO');

		if (!nav) return;

        const modelName = document.querySelector('[class*="index__profileName__"]')?.textContent?.trim();

		// Prevent unnecessary DOM updates
        if (modelName === activeModel) return;
        activeModel = modelName;

        // Cleanup previous injected links
        nav.querySelectorAll('.c4-ext-item').forEach(e => e.remove());

		// Inject links
        if (modelName && nav) {
			let html = '';
			for (const label in TOOLS) {
				html += `
					<a href="${TOOLS[label](modelName)}" target="_blank" rel="noopener noreferrer" style="color: #fff; text-decoration: none" >
                        <div class="c4-ext-item yAILi rbqYB">
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