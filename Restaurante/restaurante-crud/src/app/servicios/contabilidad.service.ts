import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Egreso } from '../modelos/contabilidad';

@Injectable({
  providedIn: 'root'
})
export class ContabilidadService {
  private apiUrl = `${environment.apiUrl}/contabilidad`;

  constructor(private http: HttpClient) {}

  getEgresos(): Observable<Egreso[]> {
    return this.http.get<Egreso[]>(`${this.apiUrl}/egresos`);
  }
}
