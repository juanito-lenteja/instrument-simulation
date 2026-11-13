import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InstrumentApiService, StateField } from '../../core/services/instrument-api.service';
import { InstrumentStateOut } from '../../generated-api/model/instrumentStateOut';

type EditableState = Pick<InstrumentStateOut, StateField>;

interface FieldStatus {
  error: string;
  pending: boolean;
  updated: boolean;
}

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

  readonly fieldStatus: Record<StateField, FieldStatus> = {
    frequency: this.createFieldStatus(),
    amplitude: this.createFieldStatus(),
    output_enabled: this.createFieldStatus()
  };

  state?: InstrumentStateOut;
  loadError = '';

  ngOnInit(): void {
    void this.loadState();
  }

  commitFrequency(): void {
    void this.saveControl(
      'frequency',
      this.stateForm.controls.frequency,
      (value) => this.instrumentApi.updateFrequency(value),
      'Frequency must be a number.'
    );
  }

  commitAmplitude(): void {
    void this.saveControl(
      'amplitude',
      this.stateForm.controls.amplitude,
      (value) => this.instrumentApi.updateAmplitude(value),
      'Amplitude must be a number.'
    );
  }

  commitOutputEnabled(): void {
    void this.saveControl(
      'output_enabled',
      this.stateForm.controls.output_enabled,
      (value) => this.instrumentApi.updateOutputEnabled(value)
    );
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

  private async saveControl<K extends StateField>(
    field: K,
    control: FormControl<EditableState[K]>,
    update: (value: EditableState[K]) => Promise<void>,
    invalidMessage = 'Invalid value.'
  ): Promise<void> {
    if (!this.state) {
      return;
    }

    const status = this.fieldStatus[field];
    if (status.pending) {
      return;
    }

    const value = control.value;
    if (control.invalid || (typeof value === 'number' && !Number.isFinite(value))) {
      status.error = invalidMessage;
      this.restoreControl(field, control);
      return;
    }

    if (!control.dirty || value === this.state[field]) {
      status.error = '';
      control.markAsPristine();
      return;
    }

    status.pending = true;
    try {
      await update(value);
      this.state = { ...this.state, [field]: value };
      control.markAsPristine();
      status.error = '';
      this.highlight(status);
    } catch (error: unknown) {
      status.error = error instanceof Error ? error.message : 'Unable to update instrument state.';
      this.restoreControl(field, control);
    } finally {
      status.pending = false;
    }
  }

  private restoreControl<K extends StateField>(
    field: K,
    control: FormControl<EditableState[K]>
  ): void {
    if (!this.state) {
      return;
    }

    control.setValue(this.state[field]);
    control.markAsPristine();
  }

  private highlight(status: FieldStatus): void {
    status.updated = true;
    setTimeout(() => {
      status.updated = false;
    }, 450);
  }

  private createFieldStatus(): FieldStatus {
    return {
      error: '',
      pending: false,
      updated: false
    };
  }
}
