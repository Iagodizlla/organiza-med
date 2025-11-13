import { parse } from 'date-fns';
import { filter, map, Observer, shareReplay, switchMap, take, tap } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ListarMedicosModel } from '../../medicos/medico.models';
import { MedicoService } from '../../medicos/medico.service';
import { PacienteService } from '../../pacientes/paciente.service';
import { NotificacaoService } from '../../shared/notificacao/notificacao.service';
import {
    DetalhesAtividadeMedicaModel, EditarAtividadeMedicaModel, EditarAtividadeMedicaResponseModel,
    TipoAtividadeMedicaEnum
} from '../atividade-medica.models';
import { AtividadeMedicaService } from '../atividade-medica.service';
import { apenasUmMedicoPorConsulta } from '../validators/apenas-um-medico-por-consulta';

@Component({
  selector: 'app-editar-atividade-medica',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './editar-atividade-medica.html',
})
export class EditarAtividadeMedica {
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly atividadeMedicaService = inject(AtividadeMedicaService);
  protected readonly medicoService = inject(MedicoService);
  protected readonly pacienteService = inject(PacienteService);
  protected readonly notificacaoService = inject(NotificacaoService);

  protected atividadeMedicaForm: FormGroup = this.formBuilder.group(
    {
      inicio: [new Date().toLocaleString('pt-Br'), [Validators.required]],
      termino: [new Date().toLocaleString('pt-Br'), [Validators.required]],
      tipoAtividade: [TipoAtividadeMedicaEnum.Consulta, [Validators.required]],
      medicos: [[], [Validators.required]],
    },
    { validators: [apenasUmMedicoPorConsulta] }
  );

  get inicio() {
    return this.atividadeMedicaForm.get('inicio');
  }

  get termino() {
    return this.atividadeMedicaForm.get('termino');
  }

  get medicos() {
    return this.atividadeMedicaForm.get('medicos');
  }

  protected readonly medicos$ = this.route.data.pipe(
    filter((data) => data['medicos']),
    map((data) => data['medicos'] as ListarMedicosModel[]),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  protected readonly atividadeMedica$ = this.route.data.pipe(
    filter((data) => data['atividadeMedica']),
    map((data) => data['atividadeMedica'] as DetalhesAtividadeMedicaModel),
    tap((atividadeMedica) =>
      this.atividadeMedicaForm.setValue({
        inicio: new Date(atividadeMedica.inicio).toLocaleString('pt-Br'),
        termino: new Date(atividadeMedica.termino).toLocaleString('pt-Br'),
        tipoAtividade: atividadeMedica.tipoAtividade,
        medicos: atividadeMedica.medicos.map((x) => x.id),
      })
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  public editar() {
    if (this.atividadeMedicaForm.invalid) return;

    const atividadeMedicaModel: EditarAtividadeMedicaModel = {
      inicio: parse(this.inicio?.value, 'dd/MM/yyyy, HH:mm:ss', new Date().toISOString()),
      termino: parse(this.termino?.value, 'dd/MM/yyyy, HH:mm:ss', new Date().toISOString()),
      medicos: Array.isArray(this.medicos?.value)
        ? [...this.medicos?.value]
        : [this.medicos?.value],
    };

    const edicaoObserver: Observer<EditarAtividadeMedicaResponseModel> = {
      next: () =>
        this.notificacaoService.sucesso(
          `A atividade médica com início em ${atividadeMedicaModel.inicio.toLocaleDateString()} foi editada com sucesso!`
        ),
      error: (err) => this.notificacaoService.erro(err),
      complete: () => this.router.navigate(['/atividades-medicas']),
    };

    this.atividadeMedica$
      .pipe(
        take(1),
        switchMap((atividadeMedica) =>
          this.atividadeMedicaService.editar(atividadeMedica.id, atividadeMedicaModel)
        )
      )
      .subscribe(edicaoObserver);
  }
}
