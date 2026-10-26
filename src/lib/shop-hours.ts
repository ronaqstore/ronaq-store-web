import type { MinutesRange, OpenStatus } from '../types/store';

const DEFAULT_TZ = 'Asia/Karachi';

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function minutesToClock(total: number, use12h: boolean): string {
  const mins = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!use12h) return `${pad2(h)}:${pad2(m)}`;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${pad2(m)} ${period}`;
}

function parseClockToken(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s+/g, ' ');
  const ampm = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (ampm) {
    let h = Number(ampm[1]);
    const m = Number(ampm[2] ?? '0');
    const period = ampm[3].toUpperCase();
    if (!Number.isInteger(h) || !Number.isInteger(m) || h < 1 || h > 12 || m > 59) {
      return null;
    }
    if (period === 'AM') {
      if (h === 12) h = 0;
    } else if (h !== 12) {
      h += 12;
    }
    return h * 60 + m;
  }

  const h24 = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (h24) {
    const h = Number(h24[1]);
    const m = Number(h24[2]);
    if (!Number.isInteger(h) || !Number.isInteger(m) || h > 23 || m > 59) return null;
    return h * 60 + m;
  }

  return null;
}

function parseHoursRange(raw: string): MinutesRange | null {
  const text = raw.trim();
  if (!text) return null;

  const match = text.match(
    /(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)\s*(?:[–—−-]|\bto\b)\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)/i
  );
  if (!match?.[1] || !match[2]) return null;

  const open = parseClockToken(match[1]);
  const close = parseClockToken(match[2]);
  if (open == null || close == null) return null;
  return { open, close };
}

function nowMinutesInTz(now: Date, timeZone: string): number | null {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(now);
    const hour = Number(parts.find((p) => p.type === 'hour')?.value);
    const minute = Number(parts.find((p) => p.type === 'minute')?.value);
    if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
    return hour * 60 + minute;
  } catch {
    return null;
  }
}

function isOpenAt(range: MinutesRange, nowMins: number): boolean {
  if (range.open === range.close) return true;
  if (range.close > range.open) {
    return nowMins >= range.open && nowMins < range.close;
  }
  return nowMins >= range.open || nowMins < range.close;
}

export function getOpenStatus(
  hours: string | null | undefined,
  now: Date = new Date(),
  tz: string = DEFAULT_TZ
): OpenStatus {
  const range = hours ? parseHoursRange(hours) : null;
  if (!range) {
    return { status: 'unknown', closesAt: null, opensAt: null };
  }

  const nowMins = nowMinutesInTz(now, tz);
  if (nowMins == null) {
    return { status: 'unknown', closesAt: null, opensAt: null };
  }

  const open = isOpenAt(range, nowMins);
  return {
    status: open ? 'open' : 'closed',
    closesAt: open ? minutesToClock(range.close, true) : null,
    opensAt: open ? null : minutesToClock(range.open, true)
  };
}

export function formatHours(
  hours: string | null | undefined,
  locale = 'en'
): string | null {
  if (!hours?.trim()) return null;
  const range = parseHoursRange(hours);
  if (!range) return hours.trim();

  const opens = minutesToClock(range.open, true);
  const closes = minutesToClock(range.close, true);
  const label = `${opens} – ${closes}`;

  if (locale === 'en') return label;

  try {
    const resolved = locale === 'ur' ? 'ur-PK' : locale === 'ps' ? 'ps-AF' : locale;
    const nf = new Intl.NumberFormat(resolved, { useGrouping: false });
    const digitMap: Record<string, string> = {};
    for (let i = 0; i < 10; i += 1) {
      digitMap[String(i)] = nf.format(i);
    }
    return label.replace(/\d/g, (d) => digitMap[d] ?? d);
  } catch {
    return label;
  }
}
