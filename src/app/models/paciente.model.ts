export class Paciente {
    IdPaciente: number;
    Financiamiento: string;
    Paciente: string;
    DNI: string;
    HistoriaClinica: number;
  
    constructor(options?: Partial<Paciente>) {
      this.IdPaciente = options?.IdPaciente || 0;
      this.Financiamiento = options?.Financiamiento || '';
      this.Paciente = options?.Paciente || '';
      this.DNI = options?.DNI || '';
      this.HistoriaClinica = options?.HistoriaClinica || 0;
    }
  }
  