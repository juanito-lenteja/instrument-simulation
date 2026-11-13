import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InstrumentApiService, StateField } from '../../core/services/instrument-api.service';
import { InstrumentStateOut } from '../../generated-api/model/instrumentStateOut';

type EditableState = Pick<InstrumentStateOut, StateField>;
type StateErrors = Partial<Record<StateField, string>>;
type StateFlags = Record<StateField, boolean>;

@Component({
  selector: 'app-state',
  imports: [ReactiveFormsModule],
  templateUrl: './state.component.html',
  styleUrl: './state.component.css'
})
export class StateComponent implements OnInit {
  private readonly instrumentApi = inject(InstrumentApiService);

  readonly stateForm = new FormGroup({
    frequency: new FormControl(0, { nonNullable: true, validators: Validators.required }),
    amplitude: new FormControl(0, { nonNullable: true, validators: Validators.required }),
    output_enabled: new FormControl(false, { nonNullable: true })
  });

  state?: InstrumentStateOut;
  errors: StateErrors = {};
  pendingFields: StateFlags = {
    frequency: false,
    amplitude: false,
    output_enabled: false
  };
  updatedFields: StateFlags = {
    frequency: false,
    amplitude: false,
    output_enabled: false
  };
  loadError = '';

  ngOnInit(): void {
    void this.loadState();
  }

  private async loadState(): Promise<void> {
    try {
      const state = await this.instrumentApi.getState();
      this.state = state;
      this.stateForm.setValue({
        frequency: state.frequency,
        amplitude: state.amplitude,
        output_enabled: state.output_enabled
      });
      this.stateForm.markAsPristine();
      this.loadError = '';
    } catch {
      this.loadError = 'Unable to load instrument state.';
    }
  }

  commit(field: StateField): void {
    switch (field) {
      case 'frequency':
        void this.commitValue(
          field,
          this.stateForm.controls.frequency,
          (value) => this.instrumentApi.updateFrequency(value)
        );
        break;
      case 'amplitude':
        void this.commitValue(
          field,
          this.stateForm.controls.amplitude,
          (value) => this.instrumentApi.updateAmplitude(value)
        );
        break;
      case 'output_enabled':
        void this.commitValue(
          field,
          this.stateForm.controls.output_enabled,
          (value) => this.instrumentApi.updateOutputEnabled(value)
        );
        break;
    }
  }

  private async commitValue<K extends StateField>(
    field: K,
    control: FormControl<EditableState[K]>,
    update: (value: EditableState[K]) => Promise<void>
  ): Promise<void> {
    if (!this.state || this.pendingFields[field]) {
      return;
    }

    const value = control.value;
    if (control.invalid || (typeof value === 'number' && !Number.isFinite(value))) {
      this.errors[field] = `${this.label(field)} must be a number.`;
      control.setValue(this.state[field]);
      control.markAsPristine();
      return;
    }

    if (!control.dirty || value === this.state[field]) {
      this.errors[field] = '';
      control.markAsPristine();
      return;
    }

    this.pendingFields[field] = true;
    try {
      await update(value);
      this.state = { ...this.state, [field]: value };
      control.markAsPristine();
      this.errors[field] = '';
      this.highlight(field);
    } catch (error: unknown) {
      this.errors[field] = this.instrumentApi.errorMessage(error, field);
      control.setValue(this.state[field]);
      control.markAsPristine();
    } finally {
      this.pendingFields[field] = false;
    }
  }

  private highlight(field: StateField): void {
    this.updatedFields[field] = true;
    setTimeout(() => {
      this.updatedFields[field] = false;
    }, 450);
  }

  private label(field: StateField): string {
    return field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
  }
}
