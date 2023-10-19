// barcode.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react'; 

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
  }); 
});

describe('Barcode Component', () => {
    it('renders without crashing', () => {
      // Provide a complete IItemInfo object
      render(<Barcode itemInfo={{ upc: '123456789012', dpci: '123-456-789', tcin: '12345' }} />);
  
      // You can add more specific tests for the rendered output if needed
    }); 
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
});

describe('matchDPCI Function', () => {
  it('returns the DPCI when it exists in the string', () => {
    const inputString = 'UPC: 123456789012 DPCI: 123-456-789 TCIN: 12345';
    const dpci = matchDPCI(inputString);
    expect(dpci).toBe('123-456-789');
  });

  it('returns null when no DPCI is found in the string', () => {
    const inputString = 'No DPCI here';
    const dpci = matchDPCI(inputString);
    expect(dpci).toBeNull();
  }); 
});

describe('matchTCIN Function', () => {
  it('returns the TCIN when it exists in the string', () => {
    const inputString = 'UPC: 123456789012 DPCI: 123-456-789 TCIN: 12345';
    const tcin = matchTCIN(inputString);
    expect(tcin).toBe('12345');
  });

  it('returns null when no TCIN is found in the string', () => {
    const inputString = 'No TCIN here';
    const tcin = matchTCIN(inputString);
    expect(tcin).toBeNull();
  }); 
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
});