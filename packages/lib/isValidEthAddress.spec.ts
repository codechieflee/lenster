import { describe, expect, test } from 'vitest';

import isValidEthAddress from './isValidEthAddress';

describe('isValidEthAddress', () => {
  test('should return true for valid Ethereum address', () => {
    const input = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const result = isValidEthAddress(input);

    expect(result).toBeTruthy();
  });

  test('should return false for invalid Ethereum address', () => {
    const input = 'invalid_address';
    const result = isValidEthAddress(input);

    expect(result).toBeFalsy();
  });
});
