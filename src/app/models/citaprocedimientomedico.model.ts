export class CitaMedicoProcedimientoResponse {
  medicoNombre: string;
  procedimientoNombre: string;
  servicioNombre:string; 
  año: number;         // Año extraído de la fecha de la cita
  mes: number;         // Mes extraído de la fecha de la cita
  cantidad: number;

  constructor(options?: Partial<CitaMedicoProcedimientoResponse>) {
    this.medicoNombre = options?.medicoNombre || '';
    this.procedimientoNombre = options?.procedimientoNombre || '';
    this.servicioNombre = options?.servicioNombre || '';
    this.año = options?.año || 0;
    this.mes = options?.mes || 0;
    this.cantidad = options?.cantidad || 0;
  }
}
