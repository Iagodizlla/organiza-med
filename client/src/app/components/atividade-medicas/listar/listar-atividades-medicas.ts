import { filter, map } from 'rxjs';

import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
    ListarAtividadesMedicasModel, MedicoAtividadeMedicaModel
} from '../atividade-medica.models';

@Component({
  selector: 'app-listar-atividades-medicas',
  imports: [MatButtonModule, MatIconModule, MatCardModule, RouterLink, AsyncPipe, DatePipe],
  templateUrl: './listar-atividades-medicas.html',
})
export class ListarAtividadesMedicas {
  protected readonly route = inject(ActivatedRoute);

  protected readonly atividadesMedicas$ = this.route.data.pipe(
    filter((data) => data['atividadesMedicas']),
    map((data) => data['atividadesMedicas'] as ListarAtividadesMedicasModel[])
  );

  public mapearNomesDeMedicos(medicos: MedicoAtividadeMedicaModel[]) {
    return medicos.map((m: MedicoAtividadeMedicaModel) => m.nome);
  }
}
