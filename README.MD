# Cam Tools Bundle

A collection of lightweight user scripts for major cam platforms. These tools integrate deep links to analytical services (**NRTool**, **CamGirlFinder**, and **RECU**) directly into the site's native interface.

## 🚀 Overview

This bundle consists of 6 scripts designed with a "Native-Feel" approach. They use the platforms' existing CSS variables and UI structures to ensure the buttons look like part of the original website.

### Included Scripts:
- **cb_ext.user.js** (Chaturbate)
- **c4_ext.user.js** (Cam4)
- **sc_ext.user.js** (Stripchat)
- **cs_ext.user.js** (Camsoda)
- **cgf_ext.user.js** (CamGirlFinder) - Includes referral bypass and NR links.
- **nr_ext.user.js** (NRTool) - Adds CGF links to history pages.

## 🛠 Features

- **Dynamic Syncing**: Works perfectly with SPA (Single Page Applications) like React and Vue. No page refresh is needed when navigating between models.
- **Hybrid Detection**: Detects model names even if they are offline (tested on Cam4).
- **Zero Performance Impact**: Uses optimized `MutationObserver` and debounced events to keep your browser fast.
- **Privacy Focused**: No external tracking, no dependencies, just pure Vanilla JS.

## 📦 Installation

### Option 1: Manual Installation
1. Install the [Tampermonkey](https://www.tampermonkey.net/) extension for your browser.
2. Click on the desired script from the directory "scripts" above.
3. Click the **"Raw"** button.
4. Tampermonkey will automatically detect the script and ask to install it.

### Option 2: The Bundle (Master Script)
If you want to manage all scripts as one unit, install script [master_camext.user.js](https://github.com/zcb22/CamExt/raw/refs/heads/main/master_camext.user.js).

## 🤝 Developer Notes

The code is written with readability and maintenance in mind:
- **Unified Logic**: All scripts follow the same architectural pattern.
- **BEM-ish CSS**: Custom elements use an `ext-` prefix to avoid conflicts with native site styles.
- **Version 1.0**: This is the initial stable release.

---
*Created by zcb22*
