export class CitaMesDTO {
    mes: string;
    cantidad: number;
  
    constructor(options?: Partial<CitaMesDTO>) {
      this.mes = options?.mes || '';
      this.cantidad = options?.cantidad || 0;
    }
  }
  