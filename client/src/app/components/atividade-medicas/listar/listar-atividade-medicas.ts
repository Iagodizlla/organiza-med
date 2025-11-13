import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter, map } from 'rxjs';
import { ListarAtividadeMedicaModel } from '../atividade-medica.models';

@Component({
  selector: 'app-listar-atividades-medicas',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink, AsyncPipe, DatePipe],
  templateUrl: './listar-atividade-medicas.html',
})
export class ListarAtividadeMedicas {
  protected readonly route = inject(ActivatedRoute);

  protected readonly atividades$ = this.route.data.pipe(
    filter((data) => data['atividades']),
    map((data) => data['atividades'] as ListarAtividadeMedicaModel[])
  );

  listarNomesMedicos(medicos: { nome: string }[] = []): string {
    return medicos.map((m) => m.nome).join(', ');
  }
}
