import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioService } from '../../servicios/inventario.service';
import { InventarioItemResponse, InventarioResumenResponse } from '../../modelos/inventario';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reportes-inventario',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, RouterModule],
  templateUrl: './reportes-inventario.component.html',
  styleUrls: ['./reportes-inventario.component.scss']
})
export class ReportesInventarioComponent implements OnInit {

  resumen: InventarioResumenResponse | null = null;
  items: InventarioItemResponse[] = [];
  loading = true;

  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.inventarioService.getResumen().subscribe({
      next: (data) => this.resumen = data,
      error: (err) => console.error('Error resumen inventario', err)
    });

    this.inventarioService.getAll().subscribe({
      next: (data) => {
        this.items = data;
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
