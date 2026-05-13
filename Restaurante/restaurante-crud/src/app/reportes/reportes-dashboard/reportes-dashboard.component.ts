import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../servicios/reporte.service';
import { InventarioService } from '../../servicios/inventario.service';
import { ResumenVentas } from '../../modelos/reporte-venta';
import { InventarioResumenResponse, InventarioItemResponse } from '../../modelos/inventario';
import { ResumenFacturacionResponse } from '../../modelos/reporte-facturacion';

import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-reportes-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './reportes-dashboard.component.html',
  styleUrls: ['./reportes-dashboard.component.scss']
})
export class ReportesDashboardComponent implements OnInit {
  resumenVentas: ResumenVentas | null = null;
  resumenInventario: InventarioResumenResponse | null = null;
  resumenFacturacion: ResumenFacturacionResponse | null = null;
  itemsBajoStock: InventarioItemResponse[] = [];
  
  loading = true;

  constructor(
    private reporteService: ReporteService,
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.reporteService.obtenerResumen().subscribe({
      next: (data) => this.resumenVentas = data,
      error: (err) => console.error('Error ventas', err)
    });

    this.inventarioService.getResumen().subscribe({
      next: (data) => this.resumenInventario = data,
      error: (err) => console.error('Error inventario', err)
    });

    this.reporteService.obtenerResumenFacturacion().subscribe({
      next: (data) => this.resumenFacturacion = data,
      error: (err) => console.error('Error facturacion', err)
    });

    this.inventarioService.getAll().subscribe({
      next: (data) => {
        this.itemsBajoStock = data.filter(i => i.bajoStock);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error items', err);
        this.loading = false;
      }
    });
  }

  formatCOP(value: number | undefined): string {
    if (value === undefined || value === null) return '$0';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  }
}
