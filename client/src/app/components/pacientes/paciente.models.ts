export interface ListarPacientesApiResponseModel {
  quantidadeRegistros: number;
  registros: ListarPacientesModel[];
}

export interface ListarPacientesModel {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}

export interface DetalhesPacienteModel {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  atividades: AtividadePacienteModel[];
}

export interface AtividadePacienteModel {
  id: string;
  inicio: Date;
  termino: Date;
  tipoAtividade: TipoAtividadePacienteEnum;
  medicos: MedicoAtividadePacienteModel[];
}

export enum TipoAtividadePacienteEnum {
  Consulta = 'Consulta',
  Cirurgia = 'Cirurgia',
}

export interface MedicoAtividadePacienteModel {
  id: string;
  nome: string;
  crm: string;
}

export interface CadastrarPacienteModel {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}

export interface CadastrarPacienteResponseModel {
  id: string;
}

export interface EditarPacienteModel {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}

export interface EditarPacienteResponseModel {
  id: string;
}
