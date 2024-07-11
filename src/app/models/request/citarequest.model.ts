export class CitaRequestDTO {
  idPaciente: number;
  nroCuenta: string;
  fecha: Date;
  horaInicio: Date;
  horaFin: Date;
  idProgramacion: number;
  idMedico: number;
  usuarioCreador: string;
  esAdicional: boolean;
  estado: EstadoCita; // Usar el enum para el estado

  constructor(options?: Partial<CitaRequestDTO>) {
      this.idPaciente = options?.idPaciente || 0;
      this.nroCuenta = options?.nroCuenta || '';
      this.fecha = options?.fecha ? new Date(options.fecha) : new Date();
      this.horaInicio = options?.horaInicio ? new Date(options.horaInicio) : new Date();
      this.horaFin = options?.horaFin ? new Date(options.horaFin) : new Date();
      this.idProgramacion = options?.idProgramacion || 0;
      this.idMedico = options?.idMedico || 0;
      this.usuarioCreador = options?.usuarioCreador || '';
      this.esAdicional = options?.esAdicional || false;
      this.estado = options?.estado || EstadoCita.ABIERTO; // Establecer un valor predeterminado para estado
  }
}
  

  export enum EstadoCita {
    ABIERTO = 'ABIERTO',
    PAGADO = 'PAGADO',
    ATENDIDO = 'ATENDIDO'
}