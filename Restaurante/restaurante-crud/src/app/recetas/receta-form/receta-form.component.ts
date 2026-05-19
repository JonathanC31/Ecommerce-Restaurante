import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';

import { RecetaService } from '../../servicios/receta.service';
import { InventarioService } from '../../servicios/inventario.service';
import { ProductoService } from '../../servicios/producto.service';
import { RecetaItem } from '../../modelos/receta';
import { InventarioItemResponse } from '../../modelos/inventario';

@Component({
  selector: 'app-receta-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    DropdownModule, InputNumberModule, ButtonModule, InputTextModule, ToastModule, DividerModule
  ],
  providers: [MessageService],
  templateUrl: './receta-form.component.html',
  styleUrls: ['./receta-form.component.scss']
})
export class RecetaFormComponent implements OnInit {
  productoId: number | null = null;
  productoNombre: string = '';
  insumos: { label: string; value: number }[] = [];
  insumosMap: Map<number, InventarioItemResponse> = new Map();
  loading = false;

  /** Human-readable labels for units */
  private unidadLabels: Record<string, string> = {
    LIBRA: 'Libra(s)',
    KILO: 'Kilo(s)',
    GRAMO: 'Gramo(s)',
    LITRO: 'Litro(s)',
    MILILITRO: 'Mililitro(s)',
    UNIDAD: 'Unidad(es)',
    PAQUETE: 'Paquete(s)'
  };

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private recetaService: RecetaService,
    private inventarioService: InventarioService,
    private productoService: ProductoService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({ lineas: this.fb.array([]) });
  }

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('productoId');
    if (!idStr) return;
    this.productoId = +idStr;

    this.productoService.getProdutos().subscribe(productos => {
      const p = productos.find(x => x.id === this.productoId);
      if (p) this.productoNombre = p.nombre;
    });

    this.inventarioService.getAll().subscribe(items => {
      this.insumosMap = new Map(items.map(i => [i.id!, i]));
      this.insumos = items.map(i => ({
        label: `${i.nombre} (${this.unidadLabel(i.unidadMedida)})`,
        value: i.id!
      }));
    });

    this.recetaService.getRecetaByProducto(this.productoId).subscribe(items => {
      items.forEach(item => this.addLinea(item));
    });
  }

  get lineas(): FormArray {
    return this.form.get('lineas') as FormArray;
  }

  addLinea(item?: RecetaItem): void {
    this.lineas.push(this.fb.group({
      inventarioItemId: [item?.inventarioItemId ?? null, Validators.required],
      cantidadUsada: [item?.cantidadUsada ?? 1, [Validators.required, Validators.min(0.001)]],
      observacion: [item?.observacion ?? '']
    }));
  }

  removeLinea(index: number): void {
    this.lineas.removeAt(index);
  }

  /** Returns the unit label for the insumo selected in the given line */
  getUnidadDeLinea(index: number): string {
    const lineaGroup = this.lineas.at(index);
    const itemId = lineaGroup?.get('inventarioItemId')?.value;
    if (!itemId) return '';
    const insumo = this.insumosMap.get(itemId);
    return insumo ? this.unidadLabel(insumo.unidadMedida) : '';
  }

  private unidadLabel(unidad: string): string {
    return this.unidadLabels[unidad] ?? unidad;
  }

  save(): void {
    if (this.form.invalid || !this.productoId) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Revisa los campos obligatorios.' });
      return;
    }

    this.loading = true;
    this.recetaService.guardarReceta(this.productoId, this.lineas.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Receta guardada correctamente.' });
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la receta.' });
        this.loading = false;
      }
    });
  }
}
