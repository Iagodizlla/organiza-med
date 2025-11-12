export interface ListarMedicosApiResponseModel {
  quantidadeRegistros: number;
  registros: ListarMedicosModel[];
}

export interface ListarMedicosModel {
  id: string;
  nome: string;
  crm: string;
}

export interface DetalhesMedicoModel {
  id: string;
  nome: string;
  crm: string;
}

export interface CadastrarMedicoModel {
  nome: string;
  crm: string;
}

export interface CadastrarMedicoResponseModel {
  id: string;
}

export interface EditarMedicoModel {
  nome: string;
  crm: string;
}

export interface EditarMedicoResponseModel {
  nome: string;
  crm: string;
}
