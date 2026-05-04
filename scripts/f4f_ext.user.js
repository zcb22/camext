// ==UserScript==
// @name         Flirt4Free: Extra Links
// @namespace    zcb_dev
// @version      1.0
// @description  Adds quick links to NRTool and CGF on Flirt4Free model profile pages for easier navigation
// @author       zcb22
// @match        https://*.flirt4free.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flirt4free.com
// ==/UserScript==

(function () {
    'use strict';

    // Domain guard for master-script compatibility
    if (!location.hostname.includes('flirt4free.com')) return;

    // Link generators
    const TOOLS = {
        'NRTool': (n) => `https://nrtool.to/nrtool/history/f4f/${n}`,
        'CGF':    (n) => `https://camgirlfinder.net/models/f4f/${n}#1`
    };

    let activeModel = '';

    /**
     * Main UI Synchronization logic
     */
    const syncUI = () => {
        const nav = document.querySelector('.live-cams-categories-header-wrap > ul');
        const player = document.querySelector('.hls-video-player');

        if (!nav) return;

        // Extract model name only if we are on a profile page with an active player
        const urlString = window.location.href;
        const url = new URL(urlString);
        let modelName = (player)
        ? url.searchParams.get('model')
        : '';

        // Prevent unnecessary DOM updates
        if (modelName === activeModel) return;
        activeModel = modelName;

        // Cleanup previous injected links
        nav.querySelectorAll('.f4f-ext-item').forEach(el => el.remove());

        // Inject links
        if (modelName && nav) {
            let html = '';
            for (const label in TOOLS) {
                html += `
					<li class="f4f-ext-item">
						<a href="${TOOLS[label](modelName)}" target="_blank" rel="noopener noreferrer">${label}</a>
					</li>`;
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