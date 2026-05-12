export interface DetalleVentaRequest {
  productoId: number;
  cantidad: number;
}

export interface CrearVentaRequest {
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  clienteDireccion: string;
  metodoPago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
  items: DetalleVentaRequest[];
}

export interface DetalleFacturaResponse {
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface FacturaResponse {
  ventaId: number;
  numeroFactura: string;
  fecha: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  clienteDireccion: string;
  metodoPago: string;
  subtotal: number;
  iva: number;
  total: number;
  estado: string;
  items: DetalleFacturaResponse[];
}