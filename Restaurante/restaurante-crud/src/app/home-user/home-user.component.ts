import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { Producto } from '../modelos/producto';
import { ProductoService } from '../servicios/producto.service';
import { AuthService } from '../servicios/auth.service';
import { VentaService } from '../servicios/venta.service';
import { CartService, CartItem } from '../servicios/cart.service';
import { CrearVentaRequest, FacturaResponse } from '../modelos/venta';
import { ToastModule } from 'primeng/toast';

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
    StyleClassModule,
    InputTextModule,
    InputTextareaModule
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
  especificacionesActual: string = '';
  isDialogVisible: boolean = false;

  carrito: CartItem[] = [];
  totalAmount: number = 0;

  loginVisible: boolean = false;
  loginUsername = '';
  loginPassword = '';
  loginLoading: boolean = false;

  checkoutStep: 'CART' | 'SHIPPING' | 'PAYMENT' | 'PROCESSING' = 'CART';
  currentVentaId: number | null = null;
  pollingInterval: any;

  checkoutFormGroup = new FormGroup({
    telefonoContacto: new FormControl('', [Validators.required]),
    barrioEntrega: new FormControl('', [Validators.required]),
    descripcionUbicacion: new FormControl('', [Validators.required]),
    direccionEntrega: new FormControl(''),
    indicacionesEntrega: new FormControl(''),
  });

  selectedMetodoPago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' = 'TARJETA';

  facturaGenerada: FacturaResponse | null = null;
  isFacturaVisible: boolean = false;

  productFormGroup: FormGroup = new FormGroup({
    producto: new FormControl(null)
  });

  categoriasMenu: CategoriaMenu[] = [
    {
      id: 'Valenciano',
      titulo: 'Valenciano',
      descripcion: 'Arroz chino sencillo + 1 pollo + papa y ensalada.',
      categoriaProducto: 'Valenciano'
    },
    {
      id: 'TodaslasCarnes',
      titulo: 'Todas las Carnes',
      descripcion: 'Arroz con carnes de res, cerdo, pollo, jamón y camarón.',
      categoriaProducto: 'Todas las Carnes'
    },
    {
      id: 'Paisa',
      titulo: 'Paisa',
      descripcion: 'Arroz con carne de res, cerdo, pollo, jamón, chicharrón y chorizo.',
      categoriaProducto: 'Paisa'
    },
    {
      id: 'Especiales',
      titulo: 'Especiales',
      descripcion: 'Platos con camarón, verduras, spaguettis y tortilla china.',
      categoriaProducto: 'Especiales'
    },
    {
      id: 'Pollo',
      titulo: 'Pollo',
      descripcion: 'Pollo brostead, asado y frito para acompañar tu pedido.',
      categoriaProducto: 'Pollo'
    },
    {
      id: 'Bebidas',
      titulo: 'Bebidas',
      descripcion: 'Gaseosas, jugos y cervezas.',
      categoriaProducto: 'Bebidas'
    }
  ];

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService,
    public authService: AuthService,
    private router: Router,
    private ventaService: VentaService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.getAllProductos();

    this.cartService.cart$.subscribe(items => {
      this.carrito = items;
      this.calculateTotal();
    });

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
    return this.cartService.getTotalItems();
  }

  addToCart(producto: Producto, especificaciones?: string): void {
    this.cartService.addToCart(producto, especificaciones);

    this.messageService.add({
      severity: 'success',
      summary: 'Añadido al pedido',
      detail: `${producto.nombre} fue agregado al carrito`
    });
    
    if (this.isDialogVisible) {
      this.isDialogVisible = false;
    }
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item.producto.id, item.especificaciones);

    this.messageService.add({
      severity: 'info',
      summary: 'Producto eliminado',
      detail: `${item.producto.nombre} fue eliminado del carrito`
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartService.getTotalAmount();
  }

  updateCartQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.producto.id, item.cantidad);
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
        severity: 'info',
        summary: 'Sesión requerida',
        detail: 'Inicia sesión para continuar con el pedido'
      });

      this.loginVisible = true;
      return;
    }

    this.checkoutStep = 'SHIPPING';
  }

  cancelCheckout(): void {
    this.checkoutStep = 'CART';
  }

  goToPayment(): void {
    if (this.checkoutFormGroup.get('telefonoContacto')?.invalid ||
        this.checkoutFormGroup.get('barrioEntrega')?.invalid ||
        this.checkoutFormGroup.get('descripcionUbicacion')?.invalid) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Por favor completa los campos obligatorios'});
      return;
    }
    this.checkoutStep = 'PAYMENT';
  }

  processPayment(): void {
    this.checkoutStep = 'PROCESSING';
    
    const fValues = this.checkoutFormGroup.value;
    const request: CrearVentaRequest = {
      clienteNombre: 'Consumidor final',
      clienteEmail: '',
      clienteTelefono: fValues.telefonoContacto || '',
      clienteDireccion: fValues.direccionEntrega || '',
      barrioEntrega: fValues.barrioEntrega || '',
      descripcionUbicacion: fValues.descripcionUbicacion || '',
      indicacionesEntrega: fValues.indicacionesEntrega || '',
      metodoPago: this.selectedMetodoPago,
      items: this.carrito.map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
        especificaciones: item.especificaciones
      }))
    };

    this.ventaService.crearVenta(request).subscribe({
      next: (response) => {
        if (response.estado === 'PENDIENTE' && response.checkoutUrl) {
          // Redirect to MercadoPago checkout
          this.currentVentaId = response.ventaId;
          window.open(response.checkoutUrl, '_blank');
          this.startPolling();
        } else if (response.estado === 'PENDIENTE') {
          this.currentVentaId = response.ventaId;
          this.startPolling();
        } else {
          this.handlePaymentSuccess(response);
        }
      },
      error: (error) => {
        console.error('Error creando venta:', error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo iniciar el pago'});
        this.checkoutStep = 'PAYMENT';
      }
    });
  }

  startPolling(): void {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
    
    this.pollingInterval = setInterval(() => {
      if (!this.currentVentaId) return;
      
      this.ventaService.actualizarEstadoPago(this.currentVentaId).subscribe({
        next: (response) => {
          if (response.estado === 'PREPARANDO' || response.estado === 'PAGADA') {
            this.handlePaymentSuccess(response);
          } else if (response.estado === 'RECHAZADA') {
            clearInterval(this.pollingInterval);
            this.messageService.add({severity: 'error', summary: 'Pago Rechazado', detail: 'El pago fue rechazado o cancelado.'});
            this.checkoutStep = 'PAYMENT';
          }
        },
        error: (err) => console.error('Error al hacer polling:', err)
      });
    }, 5000);
  }

  handlePaymentSuccess(factura: FacturaResponse): void {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
    this.facturaGenerada = factura;
    this.isFacturaVisible = true;
    this.cartService.clearCart();
    this.cartVisible = false;
    this.checkoutStep = 'CART';
    this.getAllProductos();
    this.messageService.add({severity: 'success', summary: 'Venta registrada', detail: `Pago aprobado. Factura ${factura.numeroFactura} generada`});
  }

  onCartHide(): void {
    this.checkoutStep = 'CART';
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
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
    this.especificacionesActual = '';
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

  onModalLogin(): void {
    if (!this.loginUsername || !this.loginPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ambos campos son requeridos'
      });
      return;
    }

    this.loginLoading = true;
    this.authService.authenticate({
      username: this.loginUsername,
      password: this.loginPassword
    }).subscribe({
      next: () => {
        this.loginLoading = false;
        this.loginVisible = false;
        this.loginUsername = '';
        this.loginPassword = '';
        this.messageService.add({
          severity: 'success',
          summary: 'Sesión iniciada',
          detail: 'Has iniciado sesión correctamente. Puedes continuar con el pago.'
        });
      },
      error: (error) => {
        this.loginLoading = false;
        console.error('Error login modal:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Revise sus credenciales'
        });
      }
    });
  }

  trackByIdProducto(index: number, producto: Producto): number {
    return producto.id;
  }
}