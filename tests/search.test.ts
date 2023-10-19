import { querySelectorFirst } from "../lib/util";
import { clearSearchInput, isInputInFocus, isLetterKey, openMobileSearchModal } from "../src/search";
import '@testing-library/jest-dom/extend-expect'; // for better DOM assertions

const searchInputSelectors = [
  `input[data-test="@web/SearchInputOverlayMobile"]`,
  "input#search",
  "#headerPrimary input",
  "#searchForm input",
  "nav input",
  ".search-input-form input",
  `input[type="search"]`,
];

beforeEach(() => {
  document.body.innerHTML = `
    <input data-test="@web/SearchInputOverlayMobile" />
    <input id="search" />
    <input />
  `;
  jest.clearAllMocks();
});

test("Clear input field when the reset key is pressed", () => {
  const inputEl = querySelectorFirst<HTMLInputElement>(document, searchInputSelectors)!;
  
  // null check

  if (inputEl) {
    inputEl.value = "test value";
    expect(inputEl.value).toBe("test value");

    const event = new KeyboardEvent("keydown", { key: "`" });
    document.dispatchEvent(event);

    expect(inputEl.value).toBe("");
  }
});

test("Open mobile search modal when a letter key is pressed", () => {
    const inputEl = querySelectorFirst<HTMLInputElement>(document, searchInputSelectors)!;
  inputEl.blur(); // Simulate no input field in focus

  const event = new KeyboardEvent("keydown", { key: "a" });
  document.dispatchEvent(event);

  expect(document.body.classList.contains("ReactModal__Body--open")).toBe(true);
  expect(inputEl === document.activeElement).toBe(true);
});

test("Do not open mobile search modal when a control key is pressed", () => {
  const inputEl = querySelectorFirst<HTMLInputElement>(document, searchInputSelectors)!;
  inputEl.blur(); // Simulate no input field in focus

  const event = new KeyboardEvent("keydown", { key: "a", ctrlKey: true });
  document.dispatchEvent(event);

  expect(document.body.classList.contains("ReactModal__Body--open")).toBe(false);
  expect(inputEl === document.activeElement).toBe(false);
});
