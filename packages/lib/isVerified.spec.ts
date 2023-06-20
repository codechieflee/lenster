import { describe, expect, test } from 'vitest';

import isVerified from './isVerified';

describe('isVerified', () => {
  test('should return true if the ID is included in the verified list', () => {
    expect(isVerified('0x0d')).toBeTruthy();
  });

  test('should return false if the ID is not included in the verified list', () => {
    expect(isVerified('unknownID')).toBeFalsy();
  });
});
