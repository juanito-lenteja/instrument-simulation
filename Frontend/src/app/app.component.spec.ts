import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the application shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const application = fixture.nativeElement as HTMLElement;
    expect(application.querySelector('app-banner')).toBeTruthy();
    expect(application.querySelector('app-sidebar')).toBeTruthy();
    expect(application.querySelector('router-outlet')).toBeTruthy();
  });
});
