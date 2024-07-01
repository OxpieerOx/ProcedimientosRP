
import { Medico } from './medico.model';
import { Procedimiento } from './procedimiento.model';


export class Programacion {
    id: number;
    fecha: Date; // Utilizamos Date para manejar la fecha
    horaInicio: string; // Utilizamos string para manejar la hora como texto
    horaFin: string; // Utilizamos string para manejar la hora como texto
    tiempoPromedio: number;
    fechaRegistro: Date; // Utilizamos Date para manejar la fecha y hora
    usuarioCreador: string;
    medico: Medico;
    procedimiento: Procedimiento;
  
    constructor(options?: Partial<Programacion>) {
      this.id = options?.id || 0;
      this.fecha = options?.fecha ? new Date(options.fecha) : new Date();
      this.horaInicio = options?.horaInicio || '';
      this.horaFin = options?.horaFin || '';
      this.tiempoPromedio = options?.tiempoPromedio || 0;
      this.fechaRegistro = options?.fechaRegistro ? new Date(options.fechaRegistro) : new Date();
      this.usuarioCreador = options?.usuarioCreador || '';
      this.medico = options?.medico || new Medico();
      this.procedimiento = options?.procedimiento || new Procedimiento();
    }
  }
