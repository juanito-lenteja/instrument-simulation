import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { EndpointsService } from '../../generated-api/api/endpoints.service';
import { InstrumentInfoOut } from '../../generated-api/model/instrumentInfoOut';
import { InstrumentStateOut } from '../../generated-api/model/instrumentStateOut';

export type StateField = 'amplitude' | 'frequency' | 'output_enabled';

@Injectable({ providedIn: 'root' })
export class InstrumentApiService {
  private readonly endpoints = inject(EndpointsService);

  getInfo(): Promise<InstrumentInfoOut> {
    return firstValueFrom(this.endpoints.instrumentGet());
  }

  getState(): Promise<InstrumentStateOut> {
    return firstValueFrom(this.endpoints.instrumentStateGet());
  }

  async updateFrequency(value: number): Promise<void> {
    await this.update(
      'frequency',
      firstValueFrom(this.endpoints.instrumentFrequencyPut({ frequency: value }))
    );
  }

  async updateAmplitude(value: number): Promise<void> {
    await this.update(
      'amplitude',
      firstValueFrom(this.endpoints.instrumentAmplitudePut({ amplitude: value }))
    );
  }

  async updateOutputEnabled(value: boolean): Promise<void> {
    await this.update(
      'output_enabled',
      firstValueFrom(this.endpoints.instrumentOutputEnabledPut({ output_enabled: value }))
    );
  }

  private async update(field: StateField, request: Promise<unknown>): Promise<void> {
    try {
      await request;
    } catch (error: unknown) {
      throw new Error(this.errorMessage(error, field), { cause: error });
    }
  }

  private errorMessage(error: unknown, field: StateField): string {
    if (!(error instanceof HttpErrorResponse)) {
      return `Unable to update ${this.displayName(field)}.`;
    }

    const body = error.error as Record<string, unknown> | null;
    const detail = body?.['detail'] as Record<string, unknown> | undefined;
    const json = detail?.['json'] as Record<string, unknown> | undefined;
    const messages = json?.[field];

    if (!Array.isArray(messages) || messages.length === 0) {
      return `Unable to update ${this.displayName(field)}.`;
    }

    return messages
      .map(String)
      .join(' ')
      .replaceAll('output_enabled', 'output enabled')
      .replace(/\bfalse\b/gi, 'off')
      .replace(/\btrue\b/gi, 'on');
  }

  private displayName(field: StateField): string {
    return field.replace('_', ' ');
  }
}
