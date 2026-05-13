export enum UnidadMedida {
  LIBRA = 'LIBRA',
  KILO = 'KILO',
  GRAMO = 'GRAMO',
  LITRO = 'LITRO',
  MILILITRO = 'MILILITRO',
  UNIDAD = 'UNIDAD',
  PAQUETE = 'PAQUETE'
}

export enum TipoMovimientoInventario {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
  AJUSTE = 'AJUSTE',
  DESPERDICIO = 'DESPERDICIO'
}

export interface InventarioItemRequest {
  nombre: string;
  categoria: string;
  unidadMedida: UnidadMedida;
  cantidadDisponible: number;
  stockMinimo: number;
  costoUnitario: number;
  fechaVencimiento: string | null;
  proveedor: string;
}

export interface InventarioItemResponse {
  id: number;
  nombre: string;
  categoria: string;
  unidadMedida: UnidadMedida;
  cantidadDisponible: number;
  stockMinimo: number;
  costoUnitario: number;
  fechaVencimiento: string | null;
  proveedor: string;
  activo: boolean;
  bajoStock: boolean;
}

export interface MovimientoInventarioRequest {
  itemId: number;
  tipo: TipoMovimientoInventario;
  cantidad: number;
  motivo: string;
  observacion: string;
}

export interface MovimientoInventarioResponse {
  id: number;
  itemId: number;
  itemNombre: string;
  tipo: TipoMovimientoInventario;
  cantidad: number;
  cantidadAnterior: number;
  cantidadNueva: number;
  costoUnitario: number;
  motivo: string;
  observacion: string;
  fecha: string;
}

export interface InventarioResumenResponse {
  totalItems: number;
  itemsBajoStock: number;
  itemsPorVencer: number;
  costoTotalInventario: number;
  costoDesperdicioMes: number;
}
