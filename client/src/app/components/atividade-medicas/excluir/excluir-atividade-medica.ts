import { filter, map, Observer, shareReplay, switchMap, take } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NotificacaoService } from '../../shared/notificacao/notificacao.service';
import { DetalhesAtividadeMedicaModel } from '../atividade-medica.models';
import { AtividadeMedicaService } from '../atividade-medica.service';

@Component({
  selector: 'app-excluir-atividade-medica',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    AsyncPipe,
    FormsModule,
  ],
  templateUrl: './excluir-atividade-medica.html',
})
export class ExcluirAtividadeMedica {
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly atividadeMedicaService = inject(AtividadeMedicaService);
  protected readonly notificacaoService = inject(NotificacaoService);

  protected readonly atividadeMedica$ = this.route.data.pipe(
    filter((data) => data['atividadeMedica']),
    map((data) => data['atividadeMedica'] as DetalhesAtividadeMedicaModel),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  public excluir() {
    const exclusaoObserver: Observer<null> = {
      next: () => this.notificacaoService.sucesso(`O registro foi excluído com sucesso!`),
      error: (err) => this.notificacaoService.erro(err),
      complete: () => this.router.navigate(['/atividades-medicas']),
    };

    this.atividadeMedica$
      .pipe(
        take(1),
        switchMap((atividadeMedica) => this.atividadeMedicaService.excluir(atividadeMedica.id))
      )
      .subscribe(exclusaoObserver);
  }
}
