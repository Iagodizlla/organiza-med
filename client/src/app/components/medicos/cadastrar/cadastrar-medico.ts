import { Observer } from 'rxjs';

import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';

import { NotificacaoService } from '../../shared/notificacao/notificacao.service';
import { CadastrarMedicoModel, CadastrarMedicoResponseModel } from '../medico.models';
import { MedicoService } from '../medico.service';

@Component({
  selector: 'app-cadastrar-medico',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './cadastrar-medico.html',
})
export class CadastrarMedico {
  protected readonly formBuilder = inject(FormBuilder);
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

  public cadastrar() {
    if (this.medicoForm.invalid) return;

    const medicoModel: CadastrarMedicoModel = this.medicoForm.value;

    const cadastroObserver: Observer<CadastrarMedicoResponseModel> = {
      next: () =>
        this.notificacaoService.sucesso(
          `O registro "${medicoModel.nome}" foi cadastrado com sucesso!`
        ),
      error: (err) => this.notificacaoService.erro(err),
      complete: () => this.router.navigate(['/medicos']),
    };

    this.medicoService.cadastrar(medicoModel).subscribe(cadastroObserver);
  }
}
