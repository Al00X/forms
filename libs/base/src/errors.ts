import { AbstractControl } from '@angular/forms';
import { provideAppInitializer } from '@angular/core';

const DEFAULT_CONTROL_ERROR = {
  default: `This field is incorrect.`,
  required: `This field is required.`,
  email: `Email format is incorrect.`,
  codeMelli: `National code format is incorrect.`,
  unmatched: `This field does not match.`,
  passwordLength: `Password should at least be 8 characters long.`,
  passwordChars: `Password should contain both numbers and letters.`,
} as const;

let CONTROL_ERRORS: {[p: string]: string} = {
  ...DEFAULT_CONTROL_ERROR
};

export function setControlErrors(errors: typeof CONTROL_ERRORS) {
  CONTROL_ERRORS = {
    ...DEFAULT_CONTROL_ERROR,
    ...errors,
  }
}

export function getControlErrorMessage(control: AbstractControl, customMessage?: string) {
  if (control.status !== 'INVALID') return undefined;
  if (customMessage) {
    return customMessage;
  }
  const errorKeys = Object.keys(control.errors ?? {});
  const firstKey = errorKeys.length > 0 ? errorKeys[0] : undefined;

  let error: string | undefined;
  if (firstKey) {
    error = CONTROL_ERRORS[firstKey as never];
    if (!error) {
      error = !customMessage ? CONTROL_ERRORS['default'] : customMessage;
    }
  }
  return error;
}
