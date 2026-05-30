import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CurrencyRate {
  id: number;
  currency: string;
  code: string;
  rate: number;
  effective_date: string;
  year: number;
  quarter: number;
  month: number;
  day: number;
}

export interface FetchResponse {
  saved: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  fetchRates(startDate: string, endDate: string): Observable<FetchResponse> {
    return this.http.post<FetchResponse>(`${this.apiUrl}/currencies/fetch`, {
      start_date: startDate,
      end_date: endDate
    });
  }

  getRatesByRange(startDate: string, endDate: string): Observable<CurrencyRate[]> {
    const params = new HttpParams()
      .set('start_date', startDate)
      .set('end_date', endDate);
    return this.http.get<CurrencyRate[]>(`${this.apiUrl}/currencies/range`, { params });
  }
}
