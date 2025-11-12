import { filter, map, Observer, shareReplay, switchMap, take, tap } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NotificacaoService } from '../../shared/notificacao/notificacao.service';
import {
    DetalhesMedicoModel, EditarMedicoModel, EditarMedicoResponseModel
} from '../medico.models';
import { MedicoService } from '../medico.service';

@Component({
  selector: 'app-editar-medico',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './editar-medico.html',
})
export class EditarMedico {
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly medicoService = inject(MedicoService);
  protected readonly notificacaoService = inject(NotificacaoService);

  protected medicoForm: FormGroup = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    crm: ['', [Validators.required, Validators.pattern(/^\d{5}-[A-Za-z]{2}$/)]],
  });

  get nome() {
    return this.medicoForm.get('nome');
  }

  get crm() {
    return this.medicoForm.get('crm');
  }

  protected readonly medico$ = this.route.data.pipe(
    filter((data) => data['medico']),
    map((data) => data['medico'] as DetalhesMedicoModel),
    tap((medico) => this.medicoForm.patchValue(medico)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  public editar() {
    if (this.medicoForm.invalid) return;

    const medicoModel: EditarMedicoModel = this.medicoForm.value;

    const edicaoObserver: Observer<EditarMedicoResponseModel> = {
      next: () =>
        this.notificacaoService.sucesso(
          `O registro "${medicoModel.nome}" foi editado com sucesso!`
        ),
      error: (err) => this.notificacaoService.erro(err),
      complete: () => this.router.navigate(['/medicos']),
    };

    this.medico$
      .pipe(
        take(1),
        switchMap((medico) => this.medicoService.editar(medico.id, medicoModel))
      )
      .subscribe(edicaoObserver);
  }
}
