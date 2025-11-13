export enum TipoAtividadeMedica {
  Consulta = 0,
  Cirurgia = 1
}

export interface MedicoResumoModel {
  id: string;
  nome: string;
}

export interface PacienteResumoModel {
  id: string;
  nome: string;
}

export interface ListarAtividadesApiResponseModel {
  quantidadeRegistros: number;
  registros: ListarAtividadeModel[];
}

export interface ListarAtividadeModel {
  id: string;
  tipoAtividade: TipoAtividadeMedica;
  inicio: string;
  termino?: string;
  pacienteId: string;
  pacienteNome?: string;
  medicos: MedicoResumoModel[];
}

export interface CadastrarAtividadeModel {
  tipoAtividade: TipoAtividadeMedica;
  inicio: string;
  termino?: string;
  pacienteId: string;
  medicosIds: string[];
}

export interface CadastrarAtividadeResponseModel {
  id: string;
}
