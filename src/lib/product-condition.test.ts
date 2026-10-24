import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  productConditionMessageKey,
  resolveProductCondition
} from './product-condition.ts';

describe('resolveProductCondition', () => {
  it('uses product.condition when units are empty', () => {
    assert.equal(resolveProductCondition({ condition: 'USED', units: [] }), 'USED');
    assert.equal(resolveProductCondition({ condition: 'NEW' }), 'NEW');
  });

  it('prefers unit summary including mixed stock', () => {
    assert.equal(
      resolveProductCondition({
        condition: 'NEW',
        units: [
          {
            id: '1',
            imeiMasked: '****1',
            condition: 'USED',
            batteryHealth: 90,
            price: null,
            defectNotes: null
          }
        ]
      }),
      'USED'
    );

    assert.equal(
      resolveProductCondition({
        units: [
          {
            id: '1',
            imeiMasked: '****1',
            condition: 'NEW',
            batteryHealth: null,
            price: null,
            defectNotes: null
          },
          {
            id: '2',
            imeiMasked: '****2',
            condition: 'USED',
            batteryHealth: 80,
            price: null,
            defectNotes: null
          }
        ]
      }),
      'MIXED'
    );
  });

  it('returns null when unknown', () => {
    assert.equal(resolveProductCondition({ condition: '', units: [] }), null);
  });
});

describe('productConditionMessageKey', () => {
  it('maps display values to catalog keys', () => {
    assert.equal(productConditionMessageKey('NEW'), 'conditionNew');
    assert.equal(productConditionMessageKey('USED'), 'conditionUsed');
    assert.equal(productConditionMessageKey('MIXED'), 'conditionMixed');
  });
});
