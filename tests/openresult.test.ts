import { handleKeyboardEvent } from '../src/openresult';

describe('handleKeyboardEvent', () => {
  let mockClickEl: HTMLAnchorElement | undefined;
  const mockEvent: KeyboardEvent = {
    key: '1',
    ctrlKey: false,
  } as KeyboardEvent;

  beforeAll(() => {
    // Mock querySelectorAll to return a mock array of elements
    const mockElements = [
      { href: 'https://example.com/1' },
      { href: 'https://example.com/2' }, 
    ];

    // Mock the document.querySelectorAll method
    document.querySelectorAll = jest.fn().mockReturnValue(mockElements);
    mockClickEl = mockElements[0] as HTMLAnchorElement | undefined;
  });

  beforeEach(() => {
    // Reset the mock function and properties before each test
    jest.clearAllMocks();
  });

  it('should click the first search result', () => {
    const clickSpy = jest.spyOn(mockClickEl as HTMLAnchorElement, 'click');
    handleKeyboardEvent(mockEvent);
    expect(clickSpy).toBeCalled();
  });

  it('should open a new window when Ctrl key is held', () => {
    const eventWithCtrl = { ...mockEvent, ctrlKey: true };
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    handleKeyboardEvent(eventWithCtrl);
    expect(openSpy).toBeCalledWith(mockClickEl?.href, '_blank');
  }); 

  it('should not do anything for an invalid key', () => {
    const eventWithInvalidKey = { ...mockEvent, key: 'A' };
    handleKeyboardEvent(eventWithInvalidKey);
    // Ensure no click or window.open was called
    expect(mockClickEl?.click).not.toBeCalled();
    expect(window.open).not.toBeCalled();
  });
}); 