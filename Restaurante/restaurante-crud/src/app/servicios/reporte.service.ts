import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductoVendidoReporte, ResumenVentas, VentaReporte } from '../modelos/reporte-venta';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private apiUrl = 'http://localhost:8080/api/reportes/ventas';

  constructor(private http: HttpClient) {}

  obtenerResumen(): Observable<ResumenVentas> {
    return this.http.get<ResumenVentas>(`${this.apiUrl}/resumen`);
  }

  listarVentas(): Observable<VentaReporte[]> {
    return this.http.get<VentaReporte[]>(this.apiUrl);
  }

  productosMasVendidos(): Observable<ProductoVendidoReporte[]> {
    return this.http.get<ProductoVendidoReporte[]>(`${this.apiUrl}/productos-mas-vendidos`);
  }
}