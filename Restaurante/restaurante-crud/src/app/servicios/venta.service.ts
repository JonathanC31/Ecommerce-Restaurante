import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CrearVentaRequest, FacturaResponse } from '../modelos/venta';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private apiUrl = `${environment.apiUrl}/ventas`;

  constructor(private http: HttpClient) {}

  crearVenta(request: CrearVentaRequest): Observable<FacturaResponse> {
    return this.http.post<FacturaResponse>(this.apiUrl, request);
  }

  obtenerFactura(ventaId: number): Observable<FacturaResponse> {
    return this.http.get<FacturaResponse>(`${this.apiUrl}/${ventaId}/factura`);
  }

  actualizarEstadoPago(ventaId: number): Observable<FacturaResponse> {
    return this.http.put<FacturaResponse>(`${this.apiUrl}/${ventaId}/pago/estado`, {});
  }

  getPedidosCocina(): Observable<FacturaResponse[]> {
    return this.http.get<FacturaResponse[]>(`${environment.apiUrl}/cocina/pedidos`);
  }

  marcarPedidoEntregado(ventaId: number): Observable<FacturaResponse> {
    return this.http.put<FacturaResponse>(`${environment.apiUrl}/cocina/pedidos/${ventaId}/entregado`, {});
  }
}