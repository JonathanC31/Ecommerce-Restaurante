import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ProductoVendidoReporte, VentaReporte } from '../../modelos/reporte-venta';
import { FacturaResponse } from '../../modelos/venta';
import { ReporteService } from '../../servicios/reporte.service';
import { VentaService } from '../../servicios/venta.service';

@Component({
  selector: 'app-reportes-ventas',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, TagModule, BadgeModule, DialogModule, DividerModule],
  templateUrl: './reportes-ventas.component.html',
  styleUrls: ['./reportes-ventas.component.scss']
})
export class ReportesVentasComponent implements OnInit {
 
  ventasHoy: number = 0;
  totalVendidoHoy: number = 0;
  ventasMes: number = 0;
  ticketPromedio: number = 0;
 
  ventasRecientes: VentaReporte[] = [];
  productosMasVendidos: ProductoVendidoReporte[] = [];

  isFacturaVisible: boolean = false;
  facturaSeleccionada: FacturaResponse | null = null;
 
  constructor(private reporteService: ReporteService, private ventaService: VentaService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.reporteService.obtenerResumen().subscribe({
      next: (resumen) => {
        this.ventasHoy = resumen.ventasHoy || 0;
        this.totalVendidoHoy = resumen.totalVentasHoy || 0;
        this.ventasMes = resumen.ventasMes || 0;
        this.ticketPromedio = resumen.ticketPromedio || 0;
      },
      error: (err) => console.error('Error resumen ventas', err)
    });

    this.reporteService.listarVentas().subscribe({
      next: (ventas) => this.ventasRecientes = ventas,
      error: (err) => console.error('Error ventas', err)
    });

    this.reporteService.productosMasVendidos().subscribe({
      next: (productos) => this.productosMasVendidos = productos.map(p => ({...p, icono: '🍽️'})), // Assign default icon
      error: (err) => console.error('Error productos más vendidos', err)
    });
  }
 
  getEstadoSeverity(estado: string): string {
    if (!estado) return 'info';
    const est = estado.toUpperCase();
    if (est.includes('PAGAD') || est.includes('VALIDADA') || est.includes('COMPLETAD')) return 'success';
    if (est.includes('PENDIENTE')) return 'warn';
    if (est.includes('CANCELAD') || est.includes('RECHAZAD')) return 'danger';
    return 'info';
  }
 
  verFactura(numeroFactura: string): void {
    // Necesitamos el ID de la venta, la tabla VentaReporte lo tiene?
    const venta = this.ventasRecientes.find(v => v.numeroFactura === numeroFactura);
    if (venta && venta.ventaId) {
      this.ventaService.obtenerFactura(venta.ventaId).subscribe({
        next: (factura) => {
          this.facturaSeleccionada = factura;
          this.isFacturaVisible = true;
        },
        error: (err) => console.error('Error al cargar la factura', err)
      });
    } else {
      console.warn('No se encontró el ID de la venta para la factura', numeroFactura);
    }
  }
 
  formatCOP(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }
}
