import { Component, inject, OnInit } from '@angular/core';

import { InstrumentApiService } from '../../core/services/instrument-api.service';
import { InstrumentInfoOut } from '../../generated-api/model/instrumentInfoOut';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent implements OnInit {
  private readonly instrumentApi = inject(InstrumentApiService);

  info?: InstrumentInfoOut;
  error = '';

  ngOnInit(): void {
    void this.loadInfo();
  }

  private async loadInfo(): Promise<void> {
    try {
      this.info = await this.instrumentApi.getInfo();
      this.error = '';
    } catch {
      this.error = 'Unable to load instrument information.';
    }
  }
}
