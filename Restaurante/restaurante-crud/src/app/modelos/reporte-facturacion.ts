export interface FacturaReporteResponse {
  ventaId: number;
  numeroFactura: string;
  fechaEmision: string;
  clienteNombre: string;
  metodoPago: string;
  subtotal: number;
  iva: number;
  total: number;
  estado: string;
}

export interface ResumenFacturacionResponse {
  totalFacturasMes: number;
  totalFacturadoMes: number;
  facturasValidadas: number;
  facturasPendientes: number;
  facturasRechazadas: number;
}
