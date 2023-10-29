# Turtlemay's Target Extension

This script automatically adds a barcode to product pages on [Target.com](https://target.com). Generates UPC, DPCI, and TCIN barcodes for any item, including variations (color, size, count, etc). We also remove some ads and annoyances.

### Features:
- Automatically parse and render UPC/DPCI/TCIN barcodes for all product pages.
- On search pages, automatically generate a QR code of the search term for quick entry into work devices. (This has many uses for those in the know.)
- Enter math expressions in the search box for quick calculations.

**Shortcuts for keyboard users:**

Use number keys on search page to quick select a result. Backtick and letter keys automatically focus the search field.

## Requirements

Requires a browser with support for userscripts. Recommend [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser) with [Tampermonkey](https://www.tampermonkey.net/) on Android, or Safari with [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887) on iOS.

## Installation

Our [userscript](https://turtlemay-target-web.netlify.app/turtlemay-target.user.js) is deployed via netlify. Refer to your userscript manager's documentation for how to install and update scripts (e.g. opening the js file in-browser or placing a copy in your scripts directory).

Alternatively, download [latest extension build](https://turtlemay-target-web.netlify.app/turtlemay-target.zip) to device and load zip file from your browser's extensions UI. Browser must support Chrome extensions.

## Screenshots

![](/capture.gif)

![screenshot](/screenshot.png)
