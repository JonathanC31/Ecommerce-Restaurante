import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductoFormComponent } from './producto-form/producto-form.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ReportesVentasComponent } from './reportes/reportes-ventas/reportes-ventas.component';
import { adminGuard } from './guards/admin.guard';
import { InventarioListComponent } from './inventario/inventario-list/inventario-list.component';
import { InventarioFormComponent } from './inventario/inventario-form/inventario-form.component';
import { ReportesDashboardComponent } from './reportes/reportes-dashboard/reportes-dashboard.component';
import { ReportesFacturacionComponent } from './reportes/reportes-facturacion/reportes-facturacion.component';
import { ReportesContabilidadComponent } from './reportes/reportes-contabilidad/reportes-contabilidad.component';
import { ReportesInventarioComponent } from './reportes/reportes-inventario/reportes-inventario.component';
import { ReportesVencimientosComponent } from './reportes/reportes-vencimientos/reportes-vencimientos.component';
export const routes: Routes = [
  {
    path: 'home-user',
    component: HomeUserComponent,
    title: 'Página de inicio'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Página de Admin',
    canActivate: [adminGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Inicio sesión'
  },
  {
    path: 'registro',
    component: RegistroComponent,
    title: 'Registro de Usuario'
  },
  {
    path: 'registro/:id',
    component: RegistroComponent,
    title: 'Editar Usuario'
  },
  {
    path: 'producto-form',
    component: ProductoFormComponent,
    title: 'Registro de Producto',
    canActivate: [adminGuard]
  },
  {
    path: 'producto-form/:id',
    component: ProductoFormComponent,
    title: 'Formulario de Productos',
    canActivate: [adminGuard]
  },
  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', component: ReportesDashboardComponent, title: 'Dashboard Gerencial' },
      { path: 'ventas', component: ReportesVentasComponent, title: 'Reportes de Ventas' },
      { path: 'facturacion', component: ReportesFacturacionComponent, title: 'Facturación' },
      { path: 'contabilidad', component: ReportesContabilidadComponent, title: 'Contabilidad' },
      { path: 'inventario', component: ReportesInventarioComponent, title: 'Reportes de Inventario' },
      { path: 'vencimientos', component: ReportesVencimientosComponent, title: 'Vencimientos' }
    ]
  },
  {
    path: 'inventario',
    component: InventarioListComponent,
    title: 'Inventario',
    canActivate: [adminGuard]
  },
  {
    path: 'inventario/form/:id',
    component: InventarioFormComponent,
    title: 'Materia Prima',
    canActivate: [adminGuard]
  },
  {
    path: '',
    redirectTo: 'home-user',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home-user',
    pathMatch: 'full'
  }
];
