# Turtlemay's Target Extension

This script automatically adds a barcode to product pages on [Target.com](https://target.com). Generates UPC when available, falling back to DPCI/TCIN in Code 128 format. Supports items with variations (color, size, count, etc).

Use number keys on search page to quick select a result. Backtick, Enter, and letter keys automatically focus the search field.

## Requirements

Requires a browser with support for userscripts. Recommend [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser) with [Tampermonkey](https://www.tampermonkey.net/) on Android, or Safari with [Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887) on iOS.

## Installation

Our [userscript version](https://turtlemay-target-web.netlify.app/turtlemay-target.user.js) is deployed via netlify. Refer to your userscript manager's documentation for how to install and update scripts (e.g. opening the js file in-browser or placing a copy in your scripts directory).

Alternatively, download [latest extension build](https://turtlemay-target-web.netlify.app/turtlemay-target.zip) to device and load zip file from your browser's extensions UI. Browser must support Chrome extensions.

## Screenshots

![](/capture.gif)

![screenshot](/screenshot.png)
