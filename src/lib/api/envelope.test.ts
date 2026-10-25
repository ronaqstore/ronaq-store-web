import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { extractApiData } from './envelope.ts';

describe('extractApiData', () => {
  it('returns null for malformed envelopes', () => {
    assert.equal(extractApiData(null), null);
    assert.equal(extractApiData(undefined), null);
    assert.equal(extractApiData('x'), null);
    assert.equal(extractApiData(1), null);
    assert.equal(extractApiData([]), null);
    assert.equal(extractApiData({ ok: true }), null);
    assert.equal(extractApiData({ data: null }), null);
  });

  it('returns data for valid envelopes', () => {
    assert.deepEqual(extractApiData({ data: { id: '1' } }), { id: '1' });
    assert.deepEqual(extractApiData({ success: true, data: [] }), []);
  });
});
