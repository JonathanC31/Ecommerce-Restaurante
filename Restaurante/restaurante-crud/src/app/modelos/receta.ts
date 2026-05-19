export interface RecetaItem {
  id?: number;
  productoId: number;
  productoNombre?: string;
  inventarioItemId: number;
  inventarioItemNombre?: string;
  cantidadUsada: number;
  observacion?: string;
}
