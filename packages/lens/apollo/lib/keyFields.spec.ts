import { describe, expect, test } from 'vitest';

import { publicationKeyFields } from './keyFields';

describe('keyFields', () => {
  describe('publicationKeyFields', () => {
    const publication = {
      __typename: 'Post',
      id: '123',
      createdAt: '2022-01-01'
    };

    test('should generate the expected publication key fields string', () => {
      const expectedResult = 'Post:{"id":"123","createdAt":"2022-01-01"}';
      expect(publicationKeyFields(publication)).toEqual(expectedResult);
    });

    test('should return a non-empty string', () => {
      const result = publicationKeyFields(publication);
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
