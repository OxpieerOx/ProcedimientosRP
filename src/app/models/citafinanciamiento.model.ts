export class CitaFinanciamientoDTO {
    tipoFinanciamiento: string;
    cantidad: number;
  
    constructor(options?: Partial<CitaFinanciamientoDTO>) {
      this.tipoFinanciamiento = options?.tipoFinanciamiento || '';
      this.cantidad = options?.cantidad || 0;
    }
  }
  