import { ProviderToken, inject } from '@angular/core';

export function injectOptional<T>(token: ProviderToken<T>): T | undefined {
  try {
    return inject(token);
  } catch {
    return undefined;
  }
}
