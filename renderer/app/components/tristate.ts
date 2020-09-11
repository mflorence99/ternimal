import { Component } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MatCheckboxDefaultOptions } from '@angular/material/checkbox';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

// @see https://stackoverflow.com/questions/49296051

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TriStateComponent,
      multi: true
    },
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions
    }
  ],
  selector: 'ternimal-tristate',
  templateUrl: 'tristate.html',
  styleUrls: ['tristate.scss']
})
export class TriStateComponent implements ControlValueAccessor {
  disabled = false;

  value: any;

  private onChange: Function;
  private onTouched: Function;
  private tape = [null, true, false];

  next(): void {
    this.value = this.tape[
      (this.tape.indexOf(this.value) + 1) % this.tape.length
    ];
    this.onChange(this.value);
    this.onTouched(this.value);
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  writeValue(value: boolean): void {
    this.value = value ?? this.tape[0];
  }
}
