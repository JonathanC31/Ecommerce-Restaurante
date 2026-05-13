import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ReporteService } from '../../servicios/reporte.service';
import { FacturaReporteResponse, ResumenFacturacionResponse } from '../../modelos/reporte-facturacion';

@Component({
  selector: 'app-reportes-facturacion',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule],
  templateUrl: './reportes-facturacion.component.html',
  styleUrls: ['./reportes-facturacion.component.scss']
})
export class ReportesFacturacionComponent implements OnInit {
  resumen: ResumenFacturacionResponse | null = null;
  facturas: FacturaReporteResponse[] = [];
  loading = true;

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.reporteService.obtenerResumenFacturacion().subscribe({
      next: (data) => {
        this.resumen = data;
      },
      error: (err) => console.error('Error resumen facturacion', err)
    });

    this.reporteService.listarFacturas().subscribe({
      next: (data) => {
        this.facturas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error facturas', err);
        this.loading = false;
      }
    });
  }

  getEstadoSeverity(estado: string): string {
    if (estado === 'VALIDADA') return 'success';
    if (estado === 'PENDIENTE') return 'warn';
    if (estado === 'RECHAZADA') return 'danger';
    return 'info';
  }

  formatCOP(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  }
}
