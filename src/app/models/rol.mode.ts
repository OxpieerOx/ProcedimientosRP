export class Rol {
    id:number;
    rolName: string;
    codigo: string;

    constructor(options?: Partial<Rol>) {
        this.id= options?.id || 0;
        this.rolName = options?.rolName || '';
        this.codigo = options?.codigo || '';

    }
}
