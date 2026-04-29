import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProductoService } from '../servicios/producto.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { NgIf } from '@angular/common';



@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    InputNumberModule,
    CardModule,
    NgIf
  ],
  providers: [ProductoService, MessageService],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.scss'],
})
export class ProductoFormComponent {
  formProducto!: FormGroup;
  isSaveInProgress: boolean = false;
  edit: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formProducto = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      precioUnitario: [1, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(1)]]
    });

  }
  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'new') {
      this.edit = true;
      this.getProductoById(+id!);
    }
  }

  getProductoById(id: number) {
    this.productoService.getProductoById(id).subscribe({
      next: foundProducto => {
        this.formProducto.patchValue(foundProducto)
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No encontrado'
        });
        this.router.navigateByUrl('/home')
      }
    })
  }
  createProducto() {
    if (this.formProducto.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise los datos he intente nuevamente'
      });
      return
    }
    this.isSaveInProgress = true
    this.productoService.createProducto(this.formProducto.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Guardado Correctamente'
        });
        this.isSaveInProgress = false
        this.router.navigateByUrl('/home')
      },
      error: () => {
        this.isSaveInProgress = false
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Revise los datos he intente nuevamente'
        });
        this.router.navigateByUrl('/home')
      }
    })
  }

  updateProducto() {
    if (this.formProducto.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise los datos he intente nuevamente'
      });
      return
    }
    this.isSaveInProgress = true
    this.productoService.updateProducto(this.formProducto.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Guardado Correctamente'
        });
        this.isSaveInProgress = false
        this.router.navigateByUrl('/home')
      },
      error: () => {
        this.isSaveInProgress = false
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Revise los datos he intente nuevamente'
        });
        this.router.navigateByUrl('/home')
      }
    })
  }

}
