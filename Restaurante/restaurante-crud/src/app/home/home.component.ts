import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Producto } from '../modelos/producto';
import { ProductoService } from '../servicios/producto.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../servicios/auth.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    RouterModule,
    RouterOutlet,
    NgIf,
    NgFor,
    ToastModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  productos: Producto[] = [];
  isDeleteInProgress: boolean = false;

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllProductos();
  }

  getAllProductos(): void {
    this.productoService.getProdutos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los productos'
        });
      }
    });
  }

  trackByIdProducto(index: number, producto: Producto): number {
    return producto.id!;
  }

  deleteProducto(id: number): void {
    this.isDeleteInProgress = true;

    this.productoService.deleteProducto(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Eliminado correctamente'
        });

        this.productos = this.productos.filter(producto => producto.id !== id);
        this.isDeleteInProgress = false;
      },
      error: (error) => {
        console.error('Error eliminando producto:', error);

        this.isDeleteInProgress = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se puede borrar el producto'
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
