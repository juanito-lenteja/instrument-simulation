import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BannerComponent } from './shared/components/banner/banner.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [BannerComponent, RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
