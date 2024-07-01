export class ProgramacionRequest {
    fecha: string; // LocalDate will be serialized as string
    horaInicio: string; // LocalTime will be serialized as string
    horaFin: string; // LocalTime will be serialized as string
    tiempoPromedio: number;
    fechaRegistro: string; // LocalDateTime will be serialized as string
    usuarioCreador: string;
    idMedico: number | null; // Nullable integer for idMedico
    idProcedimiento: number;
  
    constructor(data?: any) {
      if (data) {
        this.fecha = data.fecha;
        this.horaInicio = data.horaInicio;
        this.horaFin = data.horaFin;
        this.tiempoPromedio = data.tiempoPromedio;
        this.fechaRegistro = data.fechaRegistro;
        this.usuarioCreador = data.usuarioCreador;
        this.idMedico = data.idMedico || null;
        this.idProcedimiento = data.idProcedimiento;
      } else {
        this.fecha = '';
        this.horaInicio = '';
        this.horaFin = '';
        this.tiempoPromedio = 0;
        this.fechaRegistro = '';
        this.usuarioCreador = '';
        this.idMedico = null;
        this.idProcedimiento = 0;
      }
    }
  }
  