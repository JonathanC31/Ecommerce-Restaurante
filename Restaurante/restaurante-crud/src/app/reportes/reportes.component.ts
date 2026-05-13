import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent {
  views = [
    { path: '/reportes', exact: true, title: 'Dashboard Gerencial', group: 'Gerencia', icon: 'pi pi-chart-bar' },
    { path: '/reportes/ventas', exact: false, title: 'Ventas y punto de venta', group: 'Operación', icon: 'pi pi-shopping-cart' },
    { path: '/reportes/facturacion', exact: false, title: 'Facturación electrónica DIAN', group: 'Facturación', icon: 'pi pi-file' },
    { path: '/reportes/contabilidad', exact: false, title: 'Contabilidad básica', group: 'Contabilidad', icon: 'pi pi-wallet' },
    { path: '/reportes/inventario', exact: false, title: 'Control de inventarios', group: 'Inventarios', icon: 'pi pi-box' },
    { path: '/reportes/vencimientos', exact: false, title: 'Vencimientos y desperdicios', group: 'Inventarios', icon: 'pi pi-exclamation-triangle' }
  ];
}