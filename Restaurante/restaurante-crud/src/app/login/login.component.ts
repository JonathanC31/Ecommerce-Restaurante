
import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../servicios/auth.service';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FieldsetModule,
    DividerModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    RouterOutlet,
    RouterModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onLogin() {
  if (!this.username || !this.password) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ambos campos son requeridos!'
    });
    return;
  }

  this.authService.authenticate({
    username: this.username,
    password: this.password
  }).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Sesión iniciada!'
      });

      console.log('Roles:', this.authService.getRoles());

      if (this.authService.isAdmin()) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/home-user']);
      }
    },
    error: (error) => {
      console.error('Error login:', error);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise sus credenciales!'
      });
    }
  });
  }
}