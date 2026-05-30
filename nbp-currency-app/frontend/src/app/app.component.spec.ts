import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { CurrencyService } from './services/currency.service';

class MockCurrencyService {
  fetchRates() {
    return of({ saved: 1, message: 'ok' });
  }

  getRatesByRange() {
    return of([
      {
        id: 1,
        currency: 'dolar amerykański',
        code: 'USD',
        rate: 4.0,
        effective_date: '2024-01-02',
        year: 2024,
        quarter: 1,
        month: 1,
        day: 2
      }
    ]);
  }
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: CurrencyService, useClass: MockCurrencyService }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should fetch rates after button action', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.fetchRates();
    expect(app.rates.length).toBe(1);
    expect(app.rates[0].code).toBe('USD');
  });

  it('should return quarter group label', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.groupBy = 'quarter';
    const label = app.getGroupValue({
      id: 1,
      currency: 'euro',
      code: 'EUR',
      rate: 4.3,
      effective_date: '2024-04-10',
      year: 2024,
      quarter: 2,
      month: 4,
      day: 10
    });
    expect(label).toBe('2024 Q2');
  });
});
