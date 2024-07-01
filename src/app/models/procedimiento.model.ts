export class Procedimiento {
    id: number;
    nombre: string;


    constructor(options?: Partial<Procedimiento>) {
        this.id = options?.id || 0;
        this.nombre = options?.nombre || '';
       
    }
}