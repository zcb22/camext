// ==UserScript==
// @name         CamGirlFinder: Direct Links + NR Links
// @namespace    zcb
// @version      1.0
// @description  Makes "clean" links to sites and integrates NRTool links
// @author       zcb22
// @match        https://*.camgirlfinder.net/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=camgirlfinder.net
// ==/UserScript==

(function() {
    'use strict';

    // Platform mapping for direct links and NRTool database prefixes
    const CONFIG = {
        'atv': { d: 'https://amateur.tv/', n: '' },
        'bc':  { d: 'https://bongacams.com/', n: 'bc/' },
        'c4':  { d: 'https://cam4.com/', n: 'cam4/' },
        'cs':  { d: 'https://camsoda.com/', n: 'cs/' },
        'cb':  { d: 'https://chaturbate.com/', n: 'cb/' },
        'ctv': { d: 'https://cherry.tv/', n: '' },
        'f4f': { d: 'https://www.flirt4free.com/?model=', n: 'f4f/' },
        'im':  { d: 'https://imlive.com/live-sex-chats/cam-girls/video-chats/', n: '' },
        'lj':  { d: 'https://livejasmin.com/', n: '' },
        'mfc': { d: 'https://www.myfreecams.com/#', n: '' },
        'stv': { d: 'https://showup.tv/', n: '' },
        'sm':  { d: 'https://streamate.com/cam/', n: '' },
        'sr':  { d: 'https://streamray.com/', n: '' },
        'sc':  { d: 'https://stripchat.com/', n: 'sc/' }
    };

    // Inject UI styles (vertical properties for easy editing)
    if (!document.getElementById('nr-ext-styles')) {
        const style = document.createElement('style');
        style.id = 'nr-ext-styles';
        style.textContent = `
            .nr-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.15);
                color: #fff !important;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                text-decoration: none !important;
                font-weight: 600;
                font-family: inherit;
                transition: 0.2s;
                vertical-align: middle;
                line-height: 1;
            }
            .nr-btn:hover {
                background: #e54f65 !important;
                border-color: #ff5f75 !important;
            }
            .nr-btn-sm {
                width: 20px;
                height: 20px;
                font-size: 11px;
                margin-left: 0px;
                margin-top: -1px;
            }
            .nr-btn-lg {
                width: 26px;
                height: 26px;
                font-size: 14px;
                margin-left: 10px;
                margin-top: -2px;
            }
        `;
        document.head.appendChild(style);
    }

    function sync() {
        // Bypass referral redirects: replace /out/ with direct platform URLs
        document.querySelectorAll('a[href*="/out/"]').forEach(a => {
            const m = a.href.match(/\/out\/([^/]+)\/([^/?#]+)/);
            if (m && CONFIG[m[1]]) a.href = CONFIG[m[1]].d + m[2];
        });

        // Main Profile Button: Inject into H1 area
        const h1 = document.querySelector('h1');
        const h1A = h1?.querySelector('a');
        const platCode = window.location.pathname.match(/\/models\/([^/]+)\//)?.[1];

        if (h1 && h1A && platCode && CONFIG[platCode]?.n) {
            let btn = h1.querySelector('.nr-btn');
            const targetUrl = `https://nrtool.to/nrtool/history/${CONFIG[platCode].n}${encodeURIComponent(h1A.innerText.trim())}`;

            if (!btn) {
                btn = document.createElement('a');
                btn.className = 'nr-btn nr-btn-lg';
                btn.textContent = 'NR';
                btn.target = '_blank';
                btn.rel = 'noopener';
                h1.appendChild(btn);
            }
            if (btn.href !== targetUrl) btn.href = targetUrl;
        }

        // Grid Processing: Add/Update buttons for each model card
        document.querySelectorAll('.result:not(.hidden)').forEach(card => {
            const nameEl = card.querySelector('.model-name');
            const iconEl = card.querySelector('.platform-icon');
            const container = card.querySelector('p:last-child');
            const plat = iconEl?.src.match(/\/static\/([^.]+)\./)?.[1];
            const existingBtn = container?.querySelector('.nr-btn');

            if (nameEl && container && CONFIG[plat]?.n) {
                const targetUrl = `https://nrtool.to/nrtool/history/${CONFIG[plat].n}${encodeURIComponent(nameEl.innerText.trim())}`;

                if (!existingBtn) {
                    container.appendChild(document.createTextNode(' | '));
                    const btn = document.createElement('a');
                    btn.className = 'nr-btn nr-btn-sm';
                    btn.textContent = 'NR';
                    btn.target = '_blank';
                    btn.rel = 'noopener';
                    btn.href = targetUrl;
                    container.appendChild(btn);
                } else if (existingBtn.href !== targetUrl) {
                    existingBtn.href = targetUrl; // Dynamic update for SPA switches
                }
            } else if (existingBtn) {
                // Cleanup if platform changes to unsupported during navigation
                existingBtn.previousSibling?.remove();
                existingBtn.remove();
            }
        });
    }

    // High-performance observer with 50ms debounce for snappy UI updates
    let timer;
    new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(sync, 10);
    }).observe(document.body, { childList: true, subtree: true });
    sync();
})();