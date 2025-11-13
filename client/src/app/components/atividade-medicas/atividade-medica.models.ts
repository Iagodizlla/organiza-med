export interface ListarAtividadesMedicasApiResponseModel {
  quantidadeRegistros: number;
  registros: ListarAtividadesMedicasModel[];
}

export interface ListarAtividadesMedicasModel {
  id: string;
  inicio: Date;
  termino: Date;
  tipoAtividade: TipoAtividadeMedicaEnum;
  paciente: PacienteAtividadeMedicaModel;
  medicos: MedicoAtividadeMedicaModel[];
}

export interface DetalhesAtividadeMedicaModel {
  id: string;
  inicio: Date;
  termino: Date;
  tipoAtividade: TipoAtividadeMedicaEnum;
  paciente: PacienteAtividadeMedicaModel;
  medicos: MedicoAtividadeMedicaModel[];
}

export enum TipoAtividadeMedicaEnum {
  Consulta = 'Consulta',
  Cirurgia = 'Cirurgia',
}

export interface PacienteAtividadeMedicaModel {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

export interface MedicoAtividadeMedicaModel {
  id: string;
  nome: string;
  crm: string;
}

export interface CadastrarAtividadeMedicaModel {
  inicio: Date;
  termino: Date;
  tipoAtividade: TipoAtividadeMedicaEnum;
  pacienteId: string;
  medicos: string[];
}

export interface CadastrarAtividadeMedicaResponseModel {
  id: string;
}

export interface EditarAtividadeMedicaModel {
  inicio: Date;
  termino: Date;
  medicos: string[];
}

export interface EditarAtividadeMedicaResponseModel {
  id: string;
}
