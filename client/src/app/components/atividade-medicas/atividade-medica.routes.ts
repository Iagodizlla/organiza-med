import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';

import { MedicoService } from '../medicos/medico.service';
import { PacienteService } from '../pacientes/paciente.service';
import { AtividadeMedicaService } from './atividade-medica.service';
import { CadastrarAtividadeMedica } from './cadastrar/cadastrar-atividade-medica';
import { EditarAtividadeMedica } from './editar/editar-atividade-medica';
//import { ExcluirAtividadeMedica } from './excluir/excluir-atividade-medica';
import { ListarAtividadesMedicas } from './listar/listar-atividades-medicas';

export const listarAtividadesMedicasResolver = () => {
  return inject(AtividadeMedicaService).selecionarTodos();
};

export const detalhesAtividadeMedicaResolver = (route: ActivatedRouteSnapshot) => {
  const atividadeMedicaService = inject(AtividadeMedicaService);

  if (!route.paramMap.get('id')) throw new Error('O parâmetro id não foi fornecido.');

  const atividadeMedicaId = route.paramMap.get('id')!;

  return atividadeMedicaService.selecionarPorId(atividadeMedicaId);
};

export const listarPacientesResolver = () => {
  return inject(PacienteService).selecionarTodos();
};

export const listarMedicosResolver = () => {
  return inject(MedicoService).selecionarTodos();
};

export const atividadeMedicaRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListarAtividadesMedicas,
        resolve: { atividadesMedicas: listarAtividadesMedicasResolver },
      },
      {
        path: 'cadastrar',
        component: CadastrarAtividadeMedica,
        resolve: { pacientes: listarPacientesResolver, medicos: listarMedicosResolver },
      },
      {
        path: 'editar/:id',
        component: EditarAtividadeMedica,
        resolve: {
          medicos: listarMedicosResolver,
          atividadeMedica: detalhesAtividadeMedicaResolver,}
      },
      //},
      //{
      //  path: 'excluir/:id',
      //  component: ExcluirAtividadeMedica,
      //  resolve: { atividadeMedica: detalhesAtividadeMedicaResolver },
      //},
    ],
    providers: [PacienteService, MedicoService, AtividadeMedicaService],
  },
];
