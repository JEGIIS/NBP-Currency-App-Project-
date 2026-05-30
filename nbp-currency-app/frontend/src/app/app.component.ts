import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService, CurrencyRate } from './services/currency.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  startDate = '2024-01-02';
  endDate = '2024-01-05';
  groupBy: 'year' | 'quarter' | 'month' | 'day' = 'day';
  rates: CurrencyRate[] = [];
  loading = false;
  message = '';

  constructor(private currencyService: CurrencyService) {}

  fetchRates(): void {
    this.loading = true;
    this.message = '';

    this.currencyService.fetchRates(this.startDate, this.endDate).subscribe({
      next: response => {
        this.message = `${response.message}. Zapisano nowych rekordów: ${response.saved}`;
        this.loadRates();
      },
      error: () => {
        this.message = 'Nie udało się pobrać danych z API NBP.';
        this.loading = false;
      }
    });
  }

  loadRates(): void {
    this.loading = true;
    this.currencyService.getRatesByRange(this.startDate, this.endDate).subscribe({
      next: rates => {
        this.rates = rates;
        this.loading = false;
      },
      error: () => {
        this.message = 'Nie udało się pobrać danych z backendu.';
        this.loading = false;
      }
    });
  }

  get filteredRates(): CurrencyRate[] {
    return this.rates;
  }

  getGroupValue(rate: CurrencyRate): string {
    switch (this.groupBy) {
      case 'year':
        return String(rate.year);
      case 'quarter':
        return `${rate.year} Q${rate.quarter}`;
      case 'month':
        return `${rate.year}-${String(rate.month).padStart(2, '0')}`;
      case 'day':
      default:
        return rate.effective_date;
    }
  }
}
