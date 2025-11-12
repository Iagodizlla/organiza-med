import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';

import { CadastrarPaciente } from './cadastrar/cadastrar-paciente';
import { EditarPaciente } from './editar/editar-paciente';
import { ExcluirPaciente } from './excluir/excluir-paciente';
import { ListarPacientes } from './listar/listar-pacientes';
import { PacienteService } from './paciente.service';

export const listarPacientesResolver = () => {
  return inject(PacienteService).selecionarTodos();
};

export const detalhesPacienteResolver = (route: ActivatedRouteSnapshot) => {
  const pacienteService = inject(PacienteService);

  if (!route.paramMap.get('id')) throw new Error('O parâmetro id não foi fornecido.');

  const pacienteId = route.paramMap.get('id')!;

  return pacienteService.selecionarPorId(pacienteId);
};

export const pacienteRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListarPacientes,
        resolve: { pacientes: listarPacientesResolver },
      },
      {
        path: 'cadastrar',
        component: CadastrarPaciente,
      },
      {
        path: 'editar/:id',
        component: EditarPaciente,
        resolve: { paciente: detalhesPacienteResolver },
      },
      {
        path: 'excluir/:id',
        component: ExcluirPaciente,
        resolve: { paciente: detalhesPacienteResolver },
      },
    ],
    providers: [PacienteService],
  },
];
