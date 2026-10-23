const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

function formatTimeLabel(hhmm: string): string {
  if (!TIME_RE.test(hhmm)) return hhmm;
  const [hRaw, m] = hhmm.split(':');
  const h = Number(hRaw);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m} ${period}`;
}

export function formatOpeningHoursDisplay(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const match = raw
    .trim()
    .match(/(\d{1,2}:\d{2})\s*(?:[–—−-]|\bto\b)\s*(\d{1,2}:\d{2})/i);
  if (!match?.[1] || !match[2]) return raw.trim();

  const opens = normalizeHhmm(match[1]);
  const closes = normalizeHhmm(match[2]);
  if (!opens || !closes) return raw.trim();
  return `${formatTimeLabel(opens)} – ${formatTimeLabel(closes)}`;
}

function normalizeHhmm(value: string): string | null {
  const [hRaw, mRaw] = value.split(':');
  const h = Number(hRaw);
  const m = Number(mRaw);
  if (!Number.isInteger(h) || !Number.isInteger(m) || h < 0 || h > 23 || m < 0 || m > 59) {
    return null;
  }
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
