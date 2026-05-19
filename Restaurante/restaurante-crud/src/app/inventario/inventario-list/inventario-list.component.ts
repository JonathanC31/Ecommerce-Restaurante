import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InventarioService } from '../../servicios/inventario.service';
import { InventarioItemResponse, MovimientoInventarioRequest, TipoMovimientoInventario } from '../../modelos/inventario';

@Component({
  selector: 'app-inventario-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TableModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    DropdownModule,
    TooltipModule,
    FormsModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './inventario-list.component.html',
  styleUrls: ['./inventario-list.component.scss']
})
export class InventarioListComponent implements OnInit {
  items: InventarioItemResponse[] = [];
  itemsFiltrados: InventarioItemResponse[] = [];
  loading: boolean = true;

  categoriaActiva: string = 'TODAS';

  categorias = [
    { label: 'Todas', value: 'TODAS', icon: '📊' },
    { label: 'Carnes', value: 'CARNES', icon: '🥩' },
    { label: 'Granos', value: 'GRANOS', icon: '🌾' },
    { label: 'Aseo', value: 'ASEO', icon: '🧿' },
    { label: 'Lácteos', value: 'LACTEOS', icon: '🥛' },
    { label: 'Verduras', value: 'VERDURAS', icon: '🥦' },
    { label: 'Condimentos', value: 'CONDIMENTOS', icon: '🌶️' },
    { label: 'Bebidas', value: 'BEBIDAS', icon: '🍹' },
    { label: 'Otros', value: 'OTROS', icon: '📦' },
  ];

  // Modal de Movimiento
  displayMovimiento: boolean = false;
  movimientoItem: InventarioItemResponse | null = null;
  movimiento: MovimientoInventarioRequest = {
    itemId: 0,
    tipo: TipoMovimientoInventario.ENTRADA,
    cantidad: 1,
    motivo: '',
    observacion: ''
  };

  tiposMovimiento = [
    { label: 'Entrada', value: 'ENTRADA' },
    { label: 'Salida', value: 'SALIDA' },
    { label: 'Ajuste', value: 'AJUSTE' },
    { label: 'Desperdicio', value: 'DESPERDICIO' }
  ];

  constructor(
    private inventarioService: InventarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadInventario();
  }

  loadInventario() {
    this.loading = true;
    this.inventarioService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.filtrarCategoria(this.categoriaActiva);
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el inventario' });
        this.loading = false;
      }
    });
  }

  filtrarCategoria(categoria: string) {
    this.categoriaActiva = categoria;
    if (categoria === 'TODAS') {
      this.itemsFiltrados = this.items;
    } else {
      this.itemsFiltrados = this.items.filter(i =>
        i.categoria?.toUpperCase() === categoria
      );
    }
  }

  deleteItem(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro de eliminar esta materia prima?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.inventarioService.delete(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Item eliminado correctamente' });
            this.loadInventario();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el item' });
          }
        });
      }
    });
  }

  abrirMovimiento(item: InventarioItemResponse) {
    this.movimientoItem = item;
    this.movimiento = {
      itemId: item.id,
      tipo: TipoMovimientoInventario.ENTRADA,
      cantidad: 1,
      motivo: '',
      observacion: ''
    };
    this.displayMovimiento = true;
  }

  guardarMovimiento() {
    if (this.movimiento.cantidad <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'La cantidad debe ser mayor a 0' });
      return;
    }

    this.inventarioService.registrarMovimiento(this.movimiento).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Movimiento registrado correctamente' });
        this.displayMovimiento = false;
        this.loadInventario();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el movimiento' });
      }
    });
  }
}
