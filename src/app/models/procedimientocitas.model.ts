export class ProcedimientoCitas {
    procedimientoId: number;
    nombreProcedimiento: string;
    totalCitas: number;
  
    constructor(options?: Partial<ProcedimientoCitas>) {
      this.procedimientoId = options?.procedimientoId || 0;
      this.nombreProcedimiento = options?.nombreProcedimiento || '';
      this.totalCitas = options?.totalCitas || 0;
    }
  }
  