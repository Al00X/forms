import { AbstractControl, FormControlStatus, FormGroup } from '@angular/forms';
import { BehaviorSubject, map, merge, Observable, startWith } from 'rxjs';
import { isFormControlExtended } from './form-control';

export interface FormGroupExtended<TValue extends { [K in keyof TValue]: AbstractControl<any, any> } = any, DATA = any>
  extends FormGroup<TValue> {
  extended: true;

  status$: Observable<FormControlStatus>;
  invalid$: Observable<boolean>;
  valid$: Observable<boolean>;

  // data is being used as extra information that is carried by the formControl
  data$: Observable<DATA | undefined>;
  // data is being used as extra information that is carried by the formControl
  data: DATA | undefined;

  markAllAsDirty: () => void;

  setReadonly: (value: boolean, ...keys: (keyof TValue)[]) => FormGroupExtended<TValue, DATA>;
  setDisabled: (value: boolean, ...keys: (keyof TValue)[]) => FormGroupExtended<TValue, DATA>;
  // data is being used as extra information that is carried by the formControl
  setData: (value: DATA | undefined) => FormGroupExtended<TValue, DATA>;
}

export function formGroup<T extends { [K in keyof T]: AbstractControl<any, any> }, DATA = any>(inputs: T) {
  const group = new FormGroup<T>(inputs) as FormGroupExtended<T>;

  const dataTrigger = new BehaviorSubject<DATA | undefined>(undefined);

  group.extended = true;

  group.status$ = merge(group.statusChanges).pipe(startWith(group.status));
  group.invalid$ = group.status$.pipe(map((t) => t === 'INVALID'));
  group.valid$ = group.status$.pipe(map((t) => t === 'VALID'));

  group.data$ = dataTrigger.asObservable();
  group.data = undefined as any;

  const forEachControl = (fn: (key: keyof T, control: AbstractControl) => void) => {
    Object.entries(group.controls).forEach(([key, control]) => fn(key as never, control));
  };

  group.setReadonly = (value, ...keys) => {
    forEachControl((key, control) => {
      if (isFormControlExtended(control) && (keys?.length ? keys.includes(key) : true)) {
        control.setReadonly(value);
      }
    });
    return group;
  };

  group.setDisabled = (value, ...keys) => {
    forEachControl((key, control) => {
      if ((keys?.length ? keys.includes(key) : true)) {
        value ? control.disable() : control.enable();
      }
    });
    return group;
  };

  group.markAllAsDirty = () => {
    forEachControl((key, control) => {
      control.markAsDirty();
      control.markAsTouched();
    })
  }

  group.setData = (value) => {
    group.data = value;
    dataTrigger.next(value)
    return group;
  };

  return group;
}

export function isFormGroupExtended(group: FormGroup | FormGroupExtended): group is FormGroupExtended {
  return 'extended' in group;
}
