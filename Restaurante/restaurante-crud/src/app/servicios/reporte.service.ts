import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ProductoVendidoReporte, ResumenVentas, VentaReporte } from '../modelos/reporte-venta';
import { FacturaReporteResponse, ResumenFacturacionResponse } from '../modelos/reporte-facturacion';
import { MovimientoContableResponse, ResumenContabilidadResponse } from '../modelos/reporte-contabilidad';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private apiUrl = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) {}

  obtenerResumen(): Observable<ResumenVentas> {
    return this.http.get<ResumenVentas>(`${this.apiUrl}/ventas/resumen`);
  }

  listarVentas(): Observable<VentaReporte[]> {
    return this.http.get<VentaReporte[]>(`${this.apiUrl}/ventas`);
  }

  productosMasVendidos(): Observable<ProductoVendidoReporte[]> {
    return this.http.get<ProductoVendidoReporte[]>(`${this.apiUrl}/ventas/productos-mas-vendidos`);
  }

  obtenerResumenFacturacion(): Observable<ResumenFacturacionResponse> {
    return this.http.get<ResumenFacturacionResponse>(`${this.apiUrl}/facturacion/resumen`);
  }

  listarFacturas(): Observable<FacturaReporteResponse[]> {
    return this.http.get<FacturaReporteResponse[]>(`${this.apiUrl}/facturacion`);
  }

  obtenerResumenContabilidad(): Observable<ResumenContabilidadResponse> {
    return this.http.get<ResumenContabilidadResponse>(`${this.apiUrl}/contabilidad/resumen`);
  }

  listarMovimientosContables(): Observable<MovimientoContableResponse[]> {
    return this.http.get<MovimientoContableResponse[]>(`${this.apiUrl}/contabilidad/movimientos`);
  }
}