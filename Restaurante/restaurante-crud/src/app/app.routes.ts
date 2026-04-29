import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductoFormComponent } from './producto-form/producto-form.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { ReportesComponent } from './reportes/reportes.component';
import { adminGuard } from './guards/admin.guard';

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
    title: 'Reportes',
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
