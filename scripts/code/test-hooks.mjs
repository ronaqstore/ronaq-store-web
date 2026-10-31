import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const raw = pathResolve(process.cwd(), 'src', specifier.slice(2));
    const target = existsSync(raw + '.ts')
      ? raw + '.ts'
      : existsSync(raw + '/index.ts')
        ? raw + '/index.ts'
        : existsSync(raw + '.tsx')
          ? raw + '.tsx'
          : raw;
    return nextResolve(pathToFileURL(target).href, context);
  }
  if (specifier.startsWith('next/') && !specifier.endsWith('.js')) {
    const candidate = pathResolve(process.cwd(), 'node_modules', specifier + '.js');
    if (existsSync(candidate)) {
      return nextResolve(pathToFileURL(candidate).href, context);
    }
  }
  return nextResolve(specifier, context);
}
