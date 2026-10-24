import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fromPaisa, toPaisa } from './index.ts';

describe('fromPaisa', () => {
  it('converts paisa to rupees correctly', () => {
    assert.equal(fromPaisa(100), 1);
    assert.equal(fromPaisa(50000), 500);
    assert.equal(fromPaisa(0), 0);
    assert.equal(fromPaisa(250), 2.5);
  });
});

describe('toPaisa', () => {
  it('converts rupees to paisa correctly', () => {
    assert.equal(toPaisa(1), 100);
    assert.equal(toPaisa(500), 50000);
    assert.equal(toPaisa(0), 0);
    assert.equal(toPaisa(2.5), 250);
  });
});
