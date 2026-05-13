import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InventarioService } from '../../servicios/inventario.service';
import { UnidadMedida } from '../../modelos/inventario';

@Component({
  selector: 'app-inventario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './inventario-form.component.html',
  styleUrls: ['./inventario-form.component.scss']
})
export class InventarioFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  itemId: number | null = null;
  loading = false;

  unidadesMedida = [
    { label: 'Libra', value: UnidadMedida.LIBRA },
    { label: 'Kilo', value: UnidadMedida.KILO },
    { label: 'Gramo', value: UnidadMedida.GRAMO },
    { label: 'Litro', value: UnidadMedida.LITRO },
    { label: 'Mililitro', value: UnidadMedida.MILILITRO },
    { label: 'Unidad', value: UnidadMedida.UNIDAD },
    { label: 'Paquete', value: UnidadMedida.PAQUETE }
  ];

  constructor(
    private fb: FormBuilder,
    private inventarioService: InventarioService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      categoria: [''],
      unidadMedida: [UnidadMedida.LIBRA, Validators.required],
      cantidadDisponible: [0, [Validators.required, Validators.min(0)]],
      stockMinimo: [0, [Validators.required, Validators.min(0)]],
      costoUnitario: [0, [Validators.required, Validators.min(0)]],
      fechaVencimiento: [null],
      proveedor: ['']
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.isEdit = true;
      this.itemId = +idParam;
      this.loadItem();
    }
  }

  loadItem() {
    if (!this.itemId) return;
    
    this.inventarioService.getById(this.itemId).subscribe({
      next: (item) => {
        const fecha = item.fechaVencimiento ? new Date(item.fechaVencimiento) : null;
        this.form.patchValue({
          ...item,
          fechaVencimiento: fecha
        });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el item' });
        this.router.navigate(['/inventario']);
      }
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Revise los campos requeridos' });
      return;
    }

    this.loading = true;
    const formValue = this.form.value;
    
    // Convert date back to YYYY-MM-DD string if exists
    if (formValue.fechaVencimiento instanceof Date) {
      formValue.fechaVencimiento = formValue.fechaVencimiento.toISOString().split('T')[0];
    }

    const request$ = this.isEdit && this.itemId
      ? this.inventarioService.update(this.itemId, formValue)
      : this.inventarioService.create(formValue);

    request$.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Item guardado exitosamente' });
        setTimeout(() => this.router.navigate(['/inventario']), 1500);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar' });
        this.loading = false;
      }
    });
  }
}
