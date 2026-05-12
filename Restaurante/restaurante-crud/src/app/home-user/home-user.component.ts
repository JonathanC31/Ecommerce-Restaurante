import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { CardModule } from 'primeng/card';
import { MessageService, MenuItem } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToolbarModule } from 'primeng/toolbar';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { OrderListModule } from 'primeng/orderlist';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { Producto } from '../modelos/producto';
import { ProductoService } from '../servicios/producto.service';
import { AuthService } from '../servicios/auth.service';
import { VentaService } from '../servicios/venta.service';
import { CrearVentaRequest, FacturaResponse } from '../modelos/venta';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

interface CategoriaMenu {
  id: string;
  titulo: string;
  descripcion: string;
  categoriaProducto: string;
}

@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    RouterModule,
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,

    ToastModule,
    DialogModule,
    DividerModule,
    InputNumberModule,
    OrderListModule,
    FieldsetModule,
    TagModule,
    CarouselModule,
    CardModule,
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
  filteredProductos: Producto[] = [];

  items: MenuItem[] | undefined;
  isDeleteInProgress: boolean = false;

  sidebarVisible: boolean = false;
  cartVisible: boolean = false;

  responsiveOptions: any[] | undefined;

  selectedProducto: Producto | null = null;
  isDialogVisible: boolean = false;

  carrito: { producto: Producto; cantidad: number }[] = [];
  totalAmount: number = 0;

  facturaGenerada: FacturaResponse | null = null;
  isFacturaVisible: boolean = false;

  productFormGroup: FormGroup = new FormGroup({
    producto: new FormControl(null)
  });

  categoriasMenu: CategoriaMenu[] = [
    {
      id: 'Valenciano',
      titulo: 'Valenciano',
      descripcion: 'Arroz chino sencillo con pollo asado o broaster.',
      categoriaProducto: 'canasta'
    },
    {
      id: 'TodaslasCarnes',
      titulo: 'Todas las Carnes',
      descripcion: 'Arroz chino con res, cerdo, pollo y jamón.',
      categoriaProducto: 'Lacteo'
    },
    {
      id: 'Paisa',
      titulo: 'Paisa',
      descripcion: 'Arroz chino con carnes mixtas y acompañamientos especiales.',
      categoriaProducto: 'Lacteo'
    },
    {
      id: 'Pollo',
      titulo: 'Pollo',
      descripcion: 'Opciones con pollo para acompañar o armar tu pedido.',
      categoriaProducto: 'pollo'
    },
    {
      id: 'ComidasRapidas',
      titulo: 'Comidas rápidas',
      descripcion: 'Opciones rápidas para pedir y disfrutar al momento.',
      categoriaProducto: 'Comidas rápidas'
    }
  ];

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService,
    public authService: AuthService,
    private router: Router,
    private ventaService: VentaService
  ) { }

  ngOnInit(): void {
    this.getAllProductos();

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 3,
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

  productosPorCategoria(categoria: string): Producto[] {
    return this.productos.filter(
      producto => this.normalizarTexto(producto.categoria) === this.normalizarTexto(categoria)
    );
  }

  private normalizarTexto(value: string | null | undefined): string {
    return (value || '').trim().toLowerCase();
  }

  getCantidadTotalCarrito(): number {
    return this.carrito.reduce((total, item) => total + item.cantidad, 0);
  }

  addToCart(producto: Producto): void {
    if (producto.stock <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Producto agotado',
        detail: `${producto.nombre} no tiene stock disponible`
      });
      return;
    }

    const item = this.carrito.find((p) => p.producto.id === producto.id);

    if (item) {
      if (item.cantidad < producto.stock) {
        item.cantidad += 1;
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Stock máximo',
          detail: `No hay más unidades disponibles de ${producto.nombre}`
        });
        return;
      }
    } else {
      this.carrito.push({ producto, cantidad: 1 });
    }

    this.calculateTotal();

    this.messageService.add({
      severity: 'success',
      summary: 'Añadido al pedido',
      detail: `${producto.nombre} fue agregado al carrito`
    });
  }

  removeFromCart(item: { producto: Producto; cantidad: number }): void {
    this.carrito = this.carrito.filter((p) => p.producto.id !== item.producto.id);
    this.calculateTotal();

    this.messageService.add({
      severity: 'info',
      summary: 'Producto eliminado',
      detail: `${item.producto.nombre} fue eliminado del carrito`
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.carrito.reduce(
      (total, item) => total + item.producto.precioUnitario * item.cantidad,
      0
    );
  }

  checkout(): void {
    if (this.carrito.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Carrito vacío',
        detail: 'Agrega productos antes de pagar'
      });
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sesión requerida',
        detail: 'Inicia sesión para continuar con el pedido'
      });

      this.router.navigate(['/login']);
      return;
    }

    const request: CrearVentaRequest = {
      clienteNombre: 'Consumidor final',
      clienteEmail: '',
      clienteTelefono: '',
      clienteDireccion: '',
      metodoPago: 'EFECTIVO',
      items: this.carrito.map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad
      }))
    };

    this.ventaService.crearVenta(request).subscribe({
      next: (factura) => {
        this.facturaGenerada = factura;
        this.isFacturaVisible = true;

        this.carrito = [];
        this.totalAmount = 0;
        this.cartVisible = false;

        this.getAllProductos();

        this.messageService.add({
          severity: 'success',
          summary: 'Venta registrada',
          detail: `Factura ${factura.numeroFactura} generada correctamente`
        });
      },
      error: (error) => {
        console.error('Error creando venta:', error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo completar la venta'
        });
      }
    });
  }

  closeCallback(e: Event): void {
    if (this.sidebarRef) {
      this.sidebarRef.close(e);
    } else {
      this.sidebarVisible = false;
    }
  }

  filterProducto(event: AutoCompleteCompleteEvent): void {
  const query = this.normalizarTexto(event.query);

  this.filteredProductos = this.productos.filter((producto) =>
    this.normalizarTexto(producto.nombre).includes(query) ||
    this.normalizarTexto(producto.categoria).includes(query)
  );
}

  onSelectProducto(event: any): void {
    const producto: Producto = event.value;

    if (!producto) {
      return;
    }

    const categoria = this.categoriasMenu.find(
      item => this.normalizarTexto(item.categoriaProducto) === this.normalizarTexto(producto.categoria)
    );

    if (categoria) {
      setTimeout(() => {
        document.getElementById(categoria.id)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }

    this.openDialog(producto);

    this.productFormGroup.get('producto')?.setValue(null);
  }

  openDialog(producto: Producto): void {
    this.selectedProducto = producto;
    this.isDialogVisible = true;
  }

  logout(): void {
    this.authService.logout();

    this.messageService.add({
      severity: 'info',
      summary: 'Sesión cerrada',
      detail: 'Has cerrado sesión correctamente'
    });

    this.router.navigate(['/home-user']);
  }

  trackByIdProducto(index: number, producto: Producto): number {
    return producto.id;
  }
}