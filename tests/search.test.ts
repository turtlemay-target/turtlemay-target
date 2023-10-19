describe('Search', () => {
  let inputEl: HTMLInputElement;

  beforeEach(() => {
    // Create an input element and add it to the document
    inputEl = document.createElement('input');
    inputEl.value = 'test value'; // Initialize with a value

    document.body.appendChild(inputEl);
  });

  afterEach(() => {
    // Remove the input element from the document
    document.body.removeChild(inputEl);
  });

  it('Clear input field when the reset key is pressed', () => {
    // Create a mock KeyboardEvent object for the reset key (e.g., 'Esc')
    const event = new KeyboardEvent('keydown', {
      key: 'Escape', // Use the actual key for your reset operation
      ctrlKey: false,
      altKey: false,
    });

    document.dispatchEvent(event);

    // Check if the input field is cleared
    expect(inputEl.value).toBe(''); // Expect it to be an empty string
  });

  it('Open mobile search modal when a letter key is pressed', () => {
    // Create a mock KeyboardEvent object for a letter key press
    const event = new KeyboardEvent('keydown', {
      key: 'a', // Use the key for opening the mobile search modal
      ctrlKey: false,
      altKey: false,
    });

    document.dispatchEvent(event);

    // Check if the mobile search modal is opened (modify this assertion based on your code)
    expect(document.body.classList.contains('ReactModal__Body--open')).toBe(true);

    // Check if the input element is focused (modify this assertion based on your code)
    expect(inputEl === document.activeElement).toBe(true);
  });
}); 