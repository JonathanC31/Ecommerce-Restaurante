import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioService } from '../../servicios/inventario.service';
import { InventarioItemResponse, MovimientoInventarioResponse } from '../../modelos/inventario';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-reportes-vencimientos',
  standalone: true,
  imports: [CommonModule, TagModule],
  templateUrl: './reportes-vencimientos.component.html',
  styleUrls: ['./reportes-vencimientos.component.scss']
})
export class ReportesVencimientosComponent implements OnInit {

  vencimientos: InventarioItemResponse[] = [];
  desperdicios: MovimientoInventarioResponse[] = [];
  costoDesperdicioMes: number = 0;
  loading = true;

  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.inventarioService.getVencimientos(7).subscribe({
      next: (data) => {
        this.vencimientos = data;
        this.verificarCarga();
      },
      error: (err) => {
        console.error('Error vencimientos', err);
        this.verificarCarga();
      }
    });

    this.inventarioService.getDesperdicios().subscribe({
      next: (data) => {
        this.desperdicios = data;
        this.calcularCostoDesperdicio(data);
        this.verificarCarga();
      },
      error: (err) => {
        console.error('Error desperdicios', err);
        this.verificarCarga();
      }
    });
  }

  calcularCostoDesperdicio(movs: MovimientoInventarioResponse[]) {
    // Calculamos el costo sumando cantidad * costoUnitario (en el backend ya viene el total en algunos casos, o lo hacemos manual)
    this.costoDesperdicioMes = movs.reduce((acc, curr) => acc + ((curr.cantidad || 0) * (curr.costoUnitario || 0)), 0);
  }

  verificarCarga() {
    // Simulamos un loading simple
    if (this.vencimientos && this.desperdicios) {
      this.loading = false;
    }
  }

  formatCOP(value: number | undefined): string {
    if (value === undefined || value === null) return '$0';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  }

  getDiasRestantes(fechaVencimiento: string | null | undefined): number {
    if (!fechaVencimiento) return 999;
    const diff = new Date(fechaVencimiento).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }
}
