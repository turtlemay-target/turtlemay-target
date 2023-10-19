// barcode.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional matchers

import {
  BarcodeApp,
  Barcode,
  extractItemInfo,
  matchUPC,
  matchDPCI,
  matchTCIN,
} from '../src/barcode'; // Adjust the import path to match your project structure

describe('BarcodeApp Component', () => {
  it('renders without crashing', () => {
    render(<BarcodeApp />);
    // You can add more specific tests for the rendered output if needed
  });

  // Add more tests for BarcodeApp as needed
});

describe('Barcode Component', () => {
    it('renders without crashing', () => {
      // Provide a complete IItemInfo object
      render(<Barcode itemInfo={{ upc: '123456789012', dpci: '123-456-789', tcin: '12345' }} />);
  
      // You can add more specific tests for the rendered output if needed
    });
  
    // Add more tests for Barcode Component as needed
  });
  
describe('extractItemInfo Function', () => {
  it('returns item info when a valid string is provided', () => {
    const inputString = 'UPC: 123456789012 DPCI: 123-456-789 TCIN: 12345';
    const itemInfo = extractItemInfo(inputString);
    expect(itemInfo).toEqual({
      upc: '123456789012',
      dpci: '123-456-789',
      tcin: '12345',
    });
  });

  it('returns null when no item info is found', () => {
    const inputString = 'No item info here';
    const itemInfo = extractItemInfo(inputString);
    expect(itemInfo).toBeNull();
  });

  // Add more tests for extractItemInfo as needed
});

describe('matchUPC Function', () => {
  it('returns the UPC when it exists in the string', () => {
    const inputString = 'UPC: 123456789012 DPCI: 123-456-789 TCIN: 12345';
    const upc = matchUPC(inputString);
    expect(upc).toBe('123456789012');
  });

  it('returns null when no UPC is found in the string', () => {
    const inputString = 'No UPC here';
    const upc = matchUPC(inputString);
    expect(upc).toBeNull();
  });

  // Add more tests for matchUPC as needed
});

// Add similar test blocks for matchDPCI and matchTCIN functions
