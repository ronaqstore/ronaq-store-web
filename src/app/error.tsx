'use client';

import { ErrorView } from '@/components/common/error-view';
import type { LocaleAppErrorProps } from '@/types/common';

export default function RootError({ error, reset }: LocaleAppErrorProps) {
  return <ErrorView error={error} reset={reset} />;
}
