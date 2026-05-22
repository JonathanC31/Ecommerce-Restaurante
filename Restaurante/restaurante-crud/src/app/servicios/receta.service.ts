import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { RecetaItem } from '../modelos/receta';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  private apiUrl = `${environment.apiUrl}/recetas`;

  constructor(private http: HttpClient) {}

  getRecetaByProducto(productoId: number): Observable<RecetaItem[]> {
    return this.http.get<RecetaItem[]>(`${this.apiUrl}/producto/${productoId}`);
  }

  guardarReceta(productoId: number, items: RecetaItem[]): Observable<RecetaItem[]> {
    return this.http.put<RecetaItem[]>(`${this.apiUrl}/producto/${productoId}`, items);
  }

  eliminarReceta(productoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/producto/${productoId}`);
  }
}
