export class CitaRequestDTO {
  idPaciente: number;
  nroCuenta: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  idProgramacion: number;
  idMedico: number;
  usuarioCreador: string;
  esAdicional: boolean;
  estado: EstadoCita; // Usar el enum para el estado
  financiamiento: string; // Campo agregado

  constructor(options?: Partial<CitaRequestDTO>) {
      this.idPaciente = options?.idPaciente || 0;
      this.nroCuenta = options?.nroCuenta || '';
      this.fecha = options?.fecha ? options.fecha.toString() : '';
      this.horaInicio = options?.horaInicio ? options.horaInicio.toString() : '';
      this.horaFin = options?.horaFin ? options.horaFin.toString() : '';
      this.idProgramacion = options?.idProgramacion || 0;
      this.idMedico = options?.idMedico || 0;
      this.usuarioCreador = options?.usuarioCreador || '';
      this.esAdicional = options?.esAdicional || false;
      this.estado = options?.estado || EstadoCita.ABIERTO; // Establecer un valor predeterminado para estado
      this.financiamiento = options?.financiamiento || ''; // Inicializar el campo financiamiento
  }
}
  
  

  export enum EstadoCita {
    ABIERTO = 'ABIERTO',
    PAGADO = 'PAGADO',
    ATENDIDO = 'ATENDIDO'
}