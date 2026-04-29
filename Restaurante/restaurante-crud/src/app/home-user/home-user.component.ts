import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { CardModule } from 'primeng/card';
import { Producto } from '../modelos/producto';
import { ProductoService } from '../servicios/producto.service';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuItem } from 'primeng/api';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { OrderListModule } from 'primeng/orderlist';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../servicios/auth.service';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [
    NgIf,
    DialogModule,
    DividerModule,
    InputNumberModule,
    OrderListModule,
    ReactiveFormsModule,
    FormsModule,
    FieldsetModule,
    TagModule,
    CarouselModule,
    CardModule,
    CommonModule,
    RouterModule,
    RouterOutlet,
    AutoCompleteModule,
    ToolbarModule,
    SplitButtonModule,
    SidebarModule,
    ButtonModule,
    RippleModule,
    AvatarModule,
    StyleClassModule
  ],
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.scss'
})
export class HomeUserComponent implements OnInit {

  productos: Producto[] = [];
  items: MenuItem[] | undefined;
  isDeleteInProgress: boolean = false;

  sidebarVisible: boolean = false;
  responsiveOptions: any[] | undefined;

  selectedProducto: Producto | null = null;
  isDialogVisible = false;

  filteredProductos: Producto[] = [];

  cartVisible: boolean = false;
  carrito: { producto: Producto; cantidad: number }[] = [];
  totalAmount: number = 0;

  productFormGroup: FormGroup = new FormGroup({
    producto: new FormControl(null)
  });

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllProductos();

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  logout(): void {
    this.authService.logout();
    this.carrito = [];
    this.totalAmount = 0;
    this.router.navigate(['/login']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToAdmin(): void {
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  addToCart(producto: Producto): void {
    const item = this.carrito.find((p) => p.producto.id === producto.id);

    if (item) {
      item.cantidad += 1;
    } else {
      this.carrito.push({ producto, cantidad: 1 });
    }

    this.calculateTotal();
  }

  removeFromCart(item: { producto: Producto; cantidad: number }): void {
    this.carrito = this.carrito.filter((p) => p.producto.id !== item.producto.id);
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.carrito.reduce(
      (total, item) => total + item.producto.precioUnitario * item.cantidad,
      0
    );
  }

  closeCallback(e: Event): void {
    this.sidebarRef.close(e);
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

  filterProducto(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();

    this.filteredProductos = this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(query)
    );
  }

  onSelectProducto(event: any): void {
    console.log('Producto seleccionado:', event);
  }

  openDialog(producto: Producto): void {
    this.selectedProducto = producto;
    this.isDialogVisible = true;
  }

  checkout(): void {
    this.calculateTotal();

    if (!this.authService.isAuthenticated()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sesión requerida',
        detail: 'Inicia sesión para continuar con el pedido'
      });

      this.router.navigate(['/login']);
      return;
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Carrito',
      detail: 'Pedido listo para procesar'
    });
  }
}