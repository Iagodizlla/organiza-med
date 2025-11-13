import { parse } from 'date-fns';
import { filter, map, Observer, shareReplay } from 'rxjs';

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
import { ListarPacientesModel } from '../../pacientes/paciente.models';
import { PacienteService } from '../../pacientes/paciente.service';
import { NotificacaoService } from '../../shared/notificacao/notificacao.service';
import {
    CadastrarAtividadeMedicaModel, CadastrarAtividadeMedicaResponseModel, TipoAtividadeMedicaEnum
} from '../atividade-medica.models';
import { AtividadeMedicaService } from '../atividade-medica.service';
import { apenasUmMedicoPorConsulta } from '../validators/apenas-um-medico-por-consulta';

@Component({
  selector: 'app-cadastrar-atividade-medica',
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
  templateUrl: './cadastrar-atividade-medica.html',
})
export class CadastrarAtividadeMedica {
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
      pacienteId: [undefined, [Validators.required]],
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

  get tipoAtividade() {
    return this.atividadeMedicaForm.get('tipoAtividade');
  }

  get pacienteId() {
    return this.atividadeMedicaForm.get('pacienteId');
  }

  get medicos() {
    return this.atividadeMedicaForm.get('medicos');
  }

  protected readonly tiposAtividadeMedica = Object.values(TipoAtividadeMedicaEnum);

  protected readonly medicos$ = this.route.data.pipe(
    filter((data) => data['medicos']),
    map((data) => data['medicos'] as ListarMedicosModel[]),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  protected readonly pacientes$ = this.route.data.pipe(
    filter((data) => data['pacientes']),
    map((data) => data['pacientes'] as ListarPacientesModel[]),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  public cadastrar() {
    if (this.atividadeMedicaForm.invalid) return;

    const atividadeMedicaModel: CadastrarAtividadeMedicaModel = {
      ...this.atividadeMedicaForm.value,
      inicio: parse(this.inicio?.value, 'dd/MM/yyyy, HH:mm:ss', new Date().toISOString()),
      termino: parse(this.termino?.value, 'dd/MM/yyyy, HH:mm:ss', new Date().toISOString()),
      medicos: Array.isArray(this.medicos?.value)
        ? [...this.medicos?.value]
        : [this.medicos?.value],
    };

    const cadastroObserver: Observer<CadastrarAtividadeMedicaResponseModel> = {
      next: () =>
        this.notificacaoService.sucesso(
          `A atividade médica com início em ${atividadeMedicaModel.inicio.toLocaleDateString()} foi cadastrada com sucesso!`
        ),
      error: (err) => this.notificacaoService.erro(err),
      complete: () => this.router.navigate(['/atividades-medicas']),
    };

    this.atividadeMedicaService.cadastrar(atividadeMedicaModel).subscribe(cadastroObserver);
  }
}
