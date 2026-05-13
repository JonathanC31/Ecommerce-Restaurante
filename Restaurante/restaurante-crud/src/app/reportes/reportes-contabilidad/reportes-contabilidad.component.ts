import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../servicios/reporte.service';
import { MovimientoContableResponse, ResumenContabilidadResponse } from '../../modelos/reporte-contabilidad';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-reportes-contabilidad',
  standalone: true,
  imports: [CommonModule, TagModule],
  templateUrl: './reportes-contabilidad.component.html',
  styleUrls: ['./reportes-contabilidad.component.scss']
})
export class ReportesContabilidadComponent implements OnInit {

  resumen: ResumenContabilidadResponse | null = null;
  movimientos: MovimientoContableResponse[] = [];
  loading = true;

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.reporteService.obtenerResumenContabilidad().subscribe({
      next: (data) => {
        this.resumen = data;
      },
      error: (err) => console.error('Error resumen contabilidad', err)
    });

    this.reporteService.listarMovimientosContables().subscribe({
      next: (data) => {
        this.movimientos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error movimientos', err);
        this.loading = false;
      }
    });
  }

  getTipoSeverity(tipo: string): string {
    if (tipo === 'INGRESO') return 'success';
    if (tipo === 'EGRESO') return 'danger';
    if (tipo === 'PERDIDA') return 'warn';
    return 'info';
  }

  formatCOP(value: number | undefined): string {
    if (value === undefined || value === null) return '$0';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  }
}
