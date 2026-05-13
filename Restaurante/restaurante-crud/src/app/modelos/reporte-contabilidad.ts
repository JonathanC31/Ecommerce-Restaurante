export interface ResumenContabilidadResponse {
  ingresosMes: number;
  egresosMes: number;
  ivaGenerado: number;
  desperdicioValorizado: number;
  utilidadEstimada: number;
}

export interface MovimientoContableResponse {
  tipo: string;
  descripcion: string;
  valor: number;
  fecha: string;
}
