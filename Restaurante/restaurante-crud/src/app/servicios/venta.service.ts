import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrearVentaRequest, FacturaResponse } from '../modelos/venta';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private apiUrl = 'http://localhost:8080/api/ventas';

  constructor(private http: HttpClient) {}

  crearVenta(request: CrearVentaRequest): Observable<FacturaResponse> {
    return this.http.post<FacturaResponse>(this.apiUrl, request);
  }

  obtenerFactura(ventaId: number): Observable<FacturaResponse> {
    return this.http.get<FacturaResponse>(`${this.apiUrl}/${ventaId}/factura`);
  }
}