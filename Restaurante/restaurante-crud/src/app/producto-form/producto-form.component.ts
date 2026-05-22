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
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  
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
      imagenUrl: [null]
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
        this.formProducto.patchValue(foundProducto);
        if (foundProducto.imagenUrl) {
          this.imagePreviewUrl = foundProducto.imagenUrl;
        }
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
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
      next: (createdProducto) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Guardado Correctamente'
        });
        this.uploadImageAndNavigate(createdProducto.id!);
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
        const id = this.formProducto.get('id')?.value;
        this.uploadImageAndNavigate(id);
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

  uploadImageAndNavigate(productoId: number) {
    if (this.selectedFile) {
      this.productoService.uploadImagen(productoId, this.selectedFile).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Imagen Guardada',
            detail: 'La imagen del producto se subió correctamente'
          });
          this.isSaveInProgress = false;
          this.router.navigateByUrl('/home');
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error de Imagen',
            detail: 'El producto se guardó, pero hubo un error al subir la imagen'
          });
          this.isSaveInProgress = false;
          this.router.navigateByUrl('/home');
        }
      });
    } else {
      this.isSaveInProgress = false;
      this.router.navigateByUrl('/home');
    }
  }
}
