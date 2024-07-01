export class Medico {
    id: number;
    userId: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
  
    constructor(options?: Partial<Medico>) {
      this.id = options?.id || 0;
      this.userId = options?.userId || 0;
      this.nombre = options?.nombre || '';
      this.apellido = options?.apellido || '';
      this.telefono = options?.telefono || '';
      this.email = options?.email || '';
    }
  }