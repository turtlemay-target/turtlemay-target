/**
 * @file Business logic for handling search functionality.
 */

import { querySelectorFirst } from "../lib/util";

const searchInputSelectors = [
  `input[data-test="@web/SearchInputOverlayMobile"]`,
  "input#search",
  "#headerPrimary input",
  "#searchForm input",
  "nav input",
  ".search-input-form input",
  `input[type="search"]`,
];

function initializeSearchHandler() {
  addEventListener("keydown", onKeyDown);
}

function onKeyDown(event: KeyboardEvent) {
  const RESET_KEY = "`";

  if (event.key === RESET_KEY) {
    event.preventDefault();
    clearSearchInput();
  }

  if (!isInputInFocus() && isLetterKey(event)) {
    openMobileSearchModal();
  }
}

function clearSearchInput() {
  const inputEl = querySelectorFirst<HTMLInputElement>(document, searchInputSelectors);
  if (inputEl) {
    inputEl.value = "";
  }
}

function isInputInFocus() {
  return document.activeElement?.nodeName === "INPUT";
}
 
function isLetterKey(event: KeyboardEvent) {
  return event.key.match(/^[a-zA-Z]$/) && !event.ctrlKey && !event.altKey;
}

function openMobileSearchModal() {
  if (!document.body.classList.contains("ReactModal__Body--open")) {
    const clickEl = querySelectorFirst<HTMLElement>(document, [
      `input[data-test="@web/SearchInputMobile"]`,
      `input[readonly]`,
    ]);
    clickEl?.click();
  }
}

export { initializeSearchHandler, onKeyDown, clearSearchInput, isInputInFocus, isLetterKey, openMobileSearchModal };