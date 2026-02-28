// ==UserScript==
// @name         NRTool: CGF Link
// @namespace    zcb_dev
// @version      1.0
// @description  Adds a CamGirlFinder link
// @author       zcb22
// @match        https://*.nrtool.to/nrtool/history/*/*/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nrtool.to
// ==/UserScript==

(function () {
    'use strict';

    // Domain lock for safety
    if (!location.hostname.includes('nrtool.to')) return;

    // Platform mapping for URL compatibility
    const PLATFORMS = {
        'cb': 'cb',
        'bc': 'bc',
        'sc': 'sc',
        'cam4': 'c4',
        'f4f': 'f4f',
        'cs': 'cs'
    };

    /**
     * Main injection logic
     */
    const inject = () => {
        //Avoid duplicate injection
        if (document.querySelector('.nr-cgf-link')) return;

        // Extract platform and model from URL safely
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        // Expected path: /nrtool/history/{platform}/{model}
        if (pathParts.length < 4) return;

        const platKey = pathParts[2];
        const modelName = pathParts[3];

        // Find the .forum_link to use as an anchor
        const anchor = document.querySelector('.forum_link');

        // Validate and inject
        if (PLATFORMS[platKey] && modelName && anchor) {
            const targetUrl = `https://camgirlfinder.net/models/${PLATFORMS[platKey]}/${encodeURIComponent(modelName)}#1`;
            
            // Inserting the link with native styling and a small margin
            anchor.insertAdjacentHTML('afterend', `
				<span class="nr-cgf-link">
					<a href="${targetUrl}" 
					   target="_blank" 
					   rel="noopener" 
					   style="margin-left: 5px; font-weight: normal; text-decoration: underline; color: white" 
					   class="${anchor.className}">
						[CGF]
					</a>
				</span>
            `);
        }
    };
    // Execute immediately on document-idle
    inject();
})();