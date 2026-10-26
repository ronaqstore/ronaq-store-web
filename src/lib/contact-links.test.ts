import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildTelUrl,
  buildWhatsAppUrl,
  normalizePakistaniMobile
} from '../constants/api.ts';

describe('normalizePakistaniMobile', () => {
  it('normalizes 03xx local form', () => {
    assert.equal(normalizePakistaniMobile('0302-9825213'), '923029825213');
  });

  it('normalizes +92 and 0092', () => {
    assert.equal(normalizePakistaniMobile('+92 302 9825213'), '923029825213');
    assert.equal(normalizePakistaniMobile('00923029825213'), '923029825213');
  });

  it('returns null for empty', () => {
    assert.equal(normalizePakistaniMobile(null), null);
    assert.equal(normalizePakistaniMobile(''), null);
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds wa.me with message', () => {
    const url = buildWhatsAppUrl('03029825213', 'Hi, I found your shop on Ronaq Store');
    assert.equal(
      url,
      'https://wa.me/923029825213?text=Hi%2C%20I%20found%20your%20shop%20on%20Ronaq%20Store'
    );
  });

  it('returns # when phone missing', () => {
    assert.equal(buildWhatsAppUrl(null), '#');
  });
});

describe('buildTelUrl', () => {
  it('builds tel:+92…', () => {
    assert.equal(buildTelUrl('0302 9825213'), 'tel:+923029825213');
  });
});
