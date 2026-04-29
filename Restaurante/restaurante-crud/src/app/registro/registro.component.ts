import { Component } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ToastModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    CardModule,
    NgIf
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  formUser!: FormGroup;
  isSaveInProgress: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formUser = this.fb.group({
      id: [null],
      login: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.formUser.invalid) {
      this.formUser.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor completa todos los campos requeridos'
      });

      return;
    }

    this.isSaveInProgress = true;

    const user = this.formUser.value;

    this.authService.registerUser(user).subscribe({
      next: () => {
        this.isSaveInProgress = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario registrado correctamente'
        });

        this.router.navigate(['/home-user']);
      },
      error: (error) => {
        this.isSaveInProgress = false;

        console.error('Error al registrar el usuario:', error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar el usuario'
        });
      }
    });
  }
}