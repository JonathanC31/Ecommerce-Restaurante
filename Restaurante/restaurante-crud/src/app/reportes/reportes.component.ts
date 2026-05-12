import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';

export interface ResumenVentas {
  ventasHoy: number;
  totalVendidoHoy: number;
  ventasMes: number;
  ticketPromedio: number;
  productoMasVendido: string;
}
 
export interface VentaReporte {
  ventaId: number;
  numeroFactura: string;
  fecha: string;
  clienteNombre: string;
  metodoPago: string;
  total: number;
  estado: String;
}
 
export interface ProductoVendidoReporte {
  producto: string;
  cantidad: number;
  total: number;
  icono: string;
}
 
@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, TagModule, BadgeModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
 
  // ── Cards resumen ──────────────────────────────────────────────
  ventasHoy: number = 8;
  totalVendidoHoy: number = 420_000;
  ventasMes: number = 94;
  ticketPromedio: number = 61_700;
 
  // ── Tabla ventas recientes ─────────────────────────────────────
  ventasRecientes: VentaReporte[] = [
    { ventaId: 1, numeroFactura: 'FAC-000001', fecha: '2026-04-29 12:40', clienteNombre: 'Carlos Perez',    metodoPago: 'Efectivo',   total: 58_000,  estado: 'Pagado'    },
    { ventaId: 2, numeroFactura: 'FAC-000002', fecha: '2026-04-29 13:15', clienteNombre: 'Consumidor final',        metodoPago: 'Tarjeta',  total: 92_000,  estado: 'Pagado'    },
    
  ]
 
  // ── Productos más vendidos ─────────────────────────────────────
  productosMasVendidos: ProductoVendidoReporte[] = [
    { producto: 'Arroz chino especial',  cantidad: 24, total: 720_000, icono: '🍛' },
    { producto: 'Pollo broaster',        cantidad: 18,  total: 540_000, icono: '🍗' },
    
  ];
 
  ngOnInit(): void {}
 
  getEstadoSeverity(estado: string): string {
    switch (estado) {
      case 'Pagado':    return 'success';
      case 'Pendiente': return 'warn';
      case 'Cancelado': return 'danger';
      default:          return 'info';
    }
  }
 
  verFactura(factura: string): void {
    // TODO: conectar con el backend cuando esté disponible
    console.log('Ver factura:', factura);
    alert(`Abriendo factura ${factura}`);
  }
 
  formatCOP(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }
}