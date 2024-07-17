export class ProgramacionFechasRequest {
    fechas: string[]; // Lista de fechas en formato string (LocalDate)
    horaInicio: string; // LocalTime será serializado como string
    horaFin: string; // LocalTime será serializado como string
    tiempoPromedio: number;
    usuarioCreador: string;
    idMedico: number | null; // Entero opcional para idMedico
    idProcedimiento: number;
  
    constructor(data?: any) {
      if (data) {
        this.fechas = data.fechas || [];
        this.horaInicio = data.horaInicio;
        this.horaFin = data.horaFin;
        this.tiempoPromedio = data.tiempoPromedio;
        this.usuarioCreador = data.usuarioCreador;
        this.idMedico = data.idMedico || null;
        this.idProcedimiento = data.idProcedimiento;
      } else {
        this.fechas = [];
        this.horaInicio = '';
        this.horaFin = '';
        this.tiempoPromedio = 0;
        this.usuarioCreador = '';
        this.idMedico = null;
        this.idProcedimiento = 0;
      }
    }
  }
  