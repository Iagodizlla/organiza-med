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
import { DetalhesPacienteModel } from '../paciente.models';
import { PacienteService } from '../paciente.service';

@Component({
  selector: 'app-excluir-paciente',
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
  templateUrl: './excluir-paciente.html',
})
export class ExcluirPaciente {
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly pacienteService = inject(PacienteService);
  protected readonly notificacaoService = inject(NotificacaoService);

  protected readonly paciente$ = this.route.data.pipe(
    filter((data) => data['paciente']),
    map((data) => data['paciente'] as DetalhesPacienteModel),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  public excluir() {
    const exclusaoObserver: Observer<null> = {
      next: () => this.notificacaoService.sucesso(`O registro foi excluído com sucesso!`),
      error: (err) => this.notificacaoService.erro(err),
      complete: () => this.router.navigate(['/pacientes']),
    };

    this.paciente$
      .pipe(
        take(1),
        switchMap((paciente) => this.pacienteService.excluir(paciente.id))
      )
      .subscribe(exclusaoObserver);
  }
}
