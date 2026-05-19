import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../modelos/producto';

export interface CartItem {
  producto: Producto;
  cantidad: number;
  especificaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'chow-yinn-cart';
  private cart = new BehaviorSubject<CartItem[]>(this.loadCartFromStorage());

  cart$ = this.cart.asObservable();

  constructor() {}

  private loadCartFromStorage(): CartItem[] {
    const stored = localStorage.getItem(this.CART_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error al cargar carrito desde localStorage', e);
      }
    }
    return [];
  }

  private saveCartToStorage(items: CartItem[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(items));
    this.cart.next(items);
  }

  getCartItems(): CartItem[] {
    return this.cart.getValue();
  }

  addToCart(producto: Producto, especificaciones?: string): void {
    const items = this.getCartItems();
    const existing = items.find(item => item.producto.id === producto.id && item.especificaciones === especificaciones);

    if (existing) {
      existing.cantidad += 1;
    } else {
      items.push({ producto, cantidad: 1, especificaciones });
    }
    this.saveCartToStorage(items);
  }

  removeFromCart(productoId: number, especificaciones?: string): void {
    const items = this.getCartItems().filter(item => !(item.producto.id === productoId && item.especificaciones === especificaciones));
    this.saveCartToStorage(items);
  }

  updateQuantity(productoId: number, cantidad: number): void {
    const items = this.getCartItems();
    const existing = items.find(item => item.producto.id === productoId);
    if (existing) {
      existing.cantidad = cantidad;
      this.saveCartToStorage(items);
    }
  }

  clearCart(): void {
    this.saveCartToStorage([]);
  }

  getTotalAmount(): number {
    return this.getCartItems().reduce((total, item) => total + (item.producto.precioUnitario * item.cantidad), 0);
  }

  getTotalItems(): number {
    return this.getCartItems().reduce((total, item) => total + item.cantidad, 0);
  }
}
