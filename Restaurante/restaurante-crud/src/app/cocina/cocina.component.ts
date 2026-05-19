import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VentaService } from '../servicios/venta.service';
import { FacturaResponse } from '../modelos/venta';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-cocina',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastModule, ButtonModule, CardModule, TagModule],
  providers: [MessageService],
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.scss']
})
export class CocinaComponent implements OnInit, OnDestroy {
  pedidos: FacturaResponse[] = [];
  pollingInterval: any;

  constructor(
    private ventaService: VentaService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
    this.iniciarPolling();
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  cargarPedidos(): void {
    this.ventaService.getPedidosCocina().subscribe({
      next: (data) => {
        this.pedidos = data;
      },
      error: (err) => console.error('Error cargando pedidos', err)
    });
  }

  iniciarPolling(): void {
    this.pollingInterval = setInterval(() => {
      this.cargarPedidos();
    }, 10000); // Poll every 10 seconds
  }

  marcarEntregado(ventaId: number): void {
    this.ventaService.marcarPedidoEntregado(ventaId).subscribe({
      next: () => {
        this.messageService.add({severity:'success', summary:'Listo', detail:'Pedido entregado exitosamente.'});
        this.cargarPedidos();
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo actualizar el pedido.'});
        console.error(err);
      }
    });
  }
}
