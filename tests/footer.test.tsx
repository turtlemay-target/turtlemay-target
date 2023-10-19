import { insertFooterElem, elem } from '../src/footer'; // Adjust the path to your actual file location

// Mock the DOM environment if not already set up
beforeAll(() => {
  // Set up a simple DOM structure using JSDOM or another tool
  const container = document.createElement('div');
  container.id = 'root'; // You can change the ID as needed
  document.body.appendChild(container);
});

test('insertFooterElem inserts the footer element', () => {
  // Render the component or call the function that renders it
  insertFooterElem(elem);

  // Give the component time to render (if needed, for asynchronous rendering)
  return Promise.resolve().then(() => {
    // Find the footer element in the DOM
    const footer = document.querySelector('.turtlemay__footerText');
    
    // Assert that the footer element is found
    expect(footer).not.toBeNull();

    // You can add more assertions as needed for specific content or behavior.
  });
});

// Clean up the DOM structure (optional)
afterAll(() => {
  const root = document.getElementById('root');
  if (root) {
    root.remove();
  }
});