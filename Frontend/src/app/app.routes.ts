import { Routes } from '@angular/router';

import { InfoComponent } from './features/info/info.component';
import { StateComponent } from './features/state/state.component';

export const routes: Routes = [
  { path: 'info', component: InfoComponent },
  { path: 'state', component: StateComponent },
  { path: '', pathMatch: 'full', redirectTo: 'info' },
  { path: '**', redirectTo: 'info' }
];
