export interface VentaReporte {
  ventaId: number;
  numeroFactura: string;
  fecha: string;
  clienteNombre: string;
  metodoPago: string;
  total: number;
  estado: string;
}

export interface ResumenVentas {
  ventasHoy: number;
  totalVentasHoy: number;
  ventasMes: number;
  totalVentasMes: number;
  ticketPromedio: number;
  productoMasVendido: string;
}

export interface ProductoVendidoReporte {
  producto: string;
  cantidad: number;
  total: number;
  icono?: string;
}