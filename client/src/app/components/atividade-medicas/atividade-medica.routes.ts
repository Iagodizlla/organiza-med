import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AtividadeMedicaService } from './atividade-medica.service';
//import { CadastrarAtividadeMedica } from './cadastrar/cadastrar-atividade-medica';
import { ListarAtividadeMedicas } from './listar/listar-atividade-medicas';

export const listarAtividadesResolver = () => {
  return inject(AtividadeMedicaService).listar();
};

export const atividadeMedicaRoutes: Routes = [
  {
    path: '',
    component: ListarAtividadeMedicas,
    resolve: { atividades: listarAtividadesResolver },
  },
  //{
  //  path: 'cadastrar',
  //  component: CadastrarAtividadeMedica,
  //},
];
