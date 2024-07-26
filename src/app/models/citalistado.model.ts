export class CitaListado {
    id:number;
    idPaciente: string;
    nroCuenta: string;
    fecha: Date;
    horaInicio: Date;
    horaFin: Date;
    tiempoPromedio: number;
    fechaRegistro: Date;
    usuarioCreador: string;
    esAdicional: boolean;
    estado: string;
    medico: string;
    procedimiento: string;
    idMedico: number; // Nuevo campo para almacenar el ID del médico
    idProgramacion: number; // Nuevo campo para almacenar el ID de la programación
  
    constructor(options?: Partial<CitaListado>) {
      this.id = options?.id || 0;
      this.idPaciente = options?.idPaciente || '';
      this.nroCuenta = options?.nroCuenta || '';
      this.fecha = options?.fecha ? new Date(options.fecha) : new Date();
      this.horaInicio = options?.horaInicio ? new Date(options.horaInicio) : new Date();
      this.horaFin = options?.horaFin ? new Date(options.horaFin) : new Date();
      this.tiempoPromedio = options?.tiempoPromedio || 0;
      this.fechaRegistro = options?.fechaRegistro ? new Date(options.fechaRegistro) : new Date();
      this.usuarioCreador = options?.usuarioCreador || '';
      this.esAdicional = options?.esAdicional || false;
      this.estado = options?.estado || 'ABIERTO';
      this.medico = options?.medico || '';
      this.procedimiento = options?.procedimiento || '';
      this.idMedico = options?.idMedico || 0; // Asignar el ID del médico
      this.idProgramacion = options?.idProgramacion || 0; // Asignar el ID de la programación
    }
  }
  