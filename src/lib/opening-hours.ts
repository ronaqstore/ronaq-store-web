import { formatHours } from './shop-hours';

export function formatOpeningHoursDisplay(raw: string | null | undefined): string | null {
  return formatHours(raw, 'en');
}
