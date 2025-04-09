import { provideAppInitializer } from '@angular/core';
import { setControlErrors } from './errors';

export function provideFormErrors(errorsObject: {[p: string]: string}) {
  return provideAppInitializer(() => {
    setControlErrors(errorsObject);
  })
}
