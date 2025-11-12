import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';

import { CadastrarMedico } from './cadastrar/cadastrar-medico';
// import { EditarMedico } from './editar/editar-medico';
// import { ExcluirMedico } from './excluir/excluir-medico';
import { ListarMedicos } from './listar/listar-medicos';
import { MedicoService } from './medico.service';

export const listarMedicosResolver = () => {
  return inject(MedicoService).selecionarTodos();
};

export const detalhesMedicoResolver = (route: ActivatedRouteSnapshot) => {
  const medicoService = inject(MedicoService);

  if (!route.paramMap.get('id')) throw new Error('O parâmetro id não foi fornecido.');

  const medicoId = route.paramMap.get('id')!;

  return medicoService.selecionarPorId(medicoId);
};

export const medicoRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListarMedicos,
        resolve: { medicos: listarMedicosResolver },
      },
      {
        path: 'cadastrar',
        component: CadastrarMedico,
      },
      // {
      //   path: 'editar/:id',
      //   component: EditarMedico,
      //   resolve: { medico: detalhesMedicoResolver },
      // },
      // {
      //   path: 'excluir/:id',
      //   component: ExcluirMedico,
      //   resolve: { medico: detalhesMedicoResolver },
      // },
    ],
    providers: [MedicoService],
  },
];
