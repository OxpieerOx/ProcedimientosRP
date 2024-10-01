import { Medico } from './medico.model';
import { Programacion } from './programacion.model';

export class Cita {
  id: number;
  idPaciente: string;
  nroCuenta: string;
  fecha: Date;
  horaInicio: string;
  horaFin: Date;
  programacion: Programacion;
  medico: Medico;
  estado: string;
  usuarioCreador: string;
  fechaRegistro: Date;
  esAdicional: boolean;
  procedimiento:any;
  financiamiento: string; // Campo agregado
  informeDiagnostico : string;

  
  constructor(options?: Partial<Cita>) {
    this.id = options?.id || 0;
    this.idPaciente = options?.idPaciente || '';
    this.nroCuenta = options?.nroCuenta || '';
    this.fecha = options?.fecha ? new Date(options.fecha) : new Date();
    this.horaInicio = options?.horaInicio || '';
    this.horaFin = options?.horaFin ? new Date(options.horaFin) : new Date();
    this.programacion = new Programacion(options?.programacion);
    this.medico = new Medico(options?.medico);
    this.estado = options?.estado || '';
    this.usuarioCreador = options?.usuarioCreador || '';
    this.fechaRegistro = options?.fechaRegistro ? new Date(options.fechaRegistro) : new Date();
    this.esAdicional = options?.esAdicional || false;
    this.financiamiento = options?.financiamiento || ''; // Inicializar el campo financiamiento
    this.informeDiagnostico = options?.informeDiagnostico || '';
  }
}
