import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatHours, getOpenStatus } from './shop-hours.ts';

describe('getOpenStatus', () => {
  it('parses 24h hyphen range and reports open', () => {
    const now = new Date('2026-10-26T09:00:00.000Z');
    const result = getOpenStatus('10:00-21:00', now, 'Asia/Karachi');
    assert.equal(result.status, 'open');
    assert.equal(result.closesAt, '9:00 PM');
    assert.equal(result.opensAt, null);
  });

  it('parses 12h en-dash range and reports closed before open', () => {
    const now = new Date('2026-10-26T03:00:00.000Z'); 
    const result = getOpenStatus('10:00 AM – 9:00 PM', now, 'Asia/Karachi');
    assert.equal(result.status, 'closed');
    assert.equal(result.opensAt, '10:00 AM');
    assert.equal(result.closesAt, null);
  });

  it('handles ranges that cross midnight', () => {
    const late = new Date('2026-10-26T18:30:00.000Z'); 
    const openLate = getOpenStatus('22:00-02:00', late, 'Asia/Karachi');
    assert.equal(openLate.status, 'open');

    const morning = new Date('2026-10-26T00:30:00.000Z'); 
    const closedMorning = getOpenStatus('22:00-02:00', morning, 'Asia/Karachi');
    assert.equal(closedMorning.status, 'closed');
  });

  it('returns unknown for unparseable strings', () => {
    const result = getOpenStatus('Mon–Sat by appointment', new Date(), 'Asia/Karachi');
    assert.equal(result.status, 'unknown');
    assert.equal(result.closesAt, null);
    assert.equal(result.opensAt, null);
  });

  it('returns unknown for empty hours', () => {
    assert.equal(getOpenStatus(null).status, 'unknown');
    assert.equal(getOpenStatus('').status, 'unknown');
  });
});

describe('formatHours', () => {
  it('normalizes 24h seed format to 12h display', () => {
    assert.equal(formatHours('10:00-21:00', 'en'), '10:00 AM – 9:00 PM');
  });

  it('keeps unparseable raw text', () => {
    assert.equal(formatHours('24/7', 'en'), '24/7');
  });

  it('returns null for empty', () => {
    assert.equal(formatHours(null), null);
  });
});
