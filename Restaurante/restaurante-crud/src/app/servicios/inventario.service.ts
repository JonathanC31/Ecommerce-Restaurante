import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  InventarioItemRequest, 
  InventarioItemResponse, 
  InventarioResumenResponse, 
  MovimientoInventarioRequest, 
  MovimientoInventarioResponse 
} from '../modelos/inventario';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = 'http://localhost:8080/api/inventario';

  constructor(private http: HttpClient) { }

  getAll(): Observable<InventarioItemResponse[]> {
    return this.http.get<InventarioItemResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<InventarioItemResponse> {
    return this.http.get<InventarioItemResponse>(`${this.apiUrl}/${id}`);
  }

  create(item: InventarioItemRequest): Observable<InventarioItemResponse> {
    return this.http.post<InventarioItemResponse>(this.apiUrl, item);
  }

  update(id: number, item: InventarioItemRequest): Observable<InventarioItemResponse> {
    return this.http.put<InventarioItemResponse>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  registrarMovimiento(movimiento: MovimientoInventarioRequest): Observable<MovimientoInventarioResponse> {
    return this.http.post<MovimientoInventarioResponse>(`${this.apiUrl}/movimientos`, movimiento);
  }

  getMovimientos(): Observable<MovimientoInventarioResponse[]> {
    return this.http.get<MovimientoInventarioResponse[]>(`${this.apiUrl}/movimientos`);
  }

  getResumen(): Observable<InventarioResumenResponse> {
    return this.http.get<InventarioResumenResponse>(`${this.apiUrl}/resumen`);
  }

  getVencimientos(dias: number = 7): Observable<InventarioItemResponse[]> {
    return this.http.get<InventarioItemResponse[]>(`${this.apiUrl}/vencimientos?dias=${dias}`);
  }

  getDesperdicios(): Observable<MovimientoInventarioResponse[]> {
    return this.http.get<MovimientoInventarioResponse[]>(`${this.apiUrl}/desperdicios`);
  }
}
