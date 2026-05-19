import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Egreso } from '../modelos/contabilidad';

@Injectable({
  providedIn: 'root'
})
export class ContabilidadService {
  private apiUrl = 'http://localhost:8080/api/contabilidad';

  constructor(private http: HttpClient) {}

  getEgresos(): Observable<Egreso[]> {
    return this.http.get<Egreso[]>(`${this.apiUrl}/egresos`);
  }
}
