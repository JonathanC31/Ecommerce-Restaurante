import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ProductoVendidoReporte, VentaReporte } from '../../modelos/reporte-venta';
import { ReporteService } from '../../servicios/reporte.service';

@Component({
  selector: 'app-reportes-ventas',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, TagModule, BadgeModule],
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
 
  constructor(private reporteService: ReporteService) {}

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
 
  verFactura(factura: string): void {
    // TODO: conectar con el backend cuando esté disponible el PDF/modal de la factura
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
