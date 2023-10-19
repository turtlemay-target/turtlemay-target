import manifestJson from "../manifest.json";

// Mock the console.info function
jest.mock("console");
const mockedConsoleInfo = jest.spyOn(console, 'info');
mockedConsoleInfo.mockReturnValue();

// Import the module you want to test
import { displayWelcomeMessage } from "../src/welcome";

describe("Welcome Module", () => {
  it("should log the correct welcome message", () => {
    // Run the function that logs the welcome message
    displayWelcomeMessage();

    // Check if console.info was called with the expected message 
    expect(mockedConsoleInfo).toHaveBeenCalledWith(`🧩 Using ${manifestJson.name} ${manifestJson.version}.`);

  });
});