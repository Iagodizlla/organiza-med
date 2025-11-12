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
import { CadastrarPacienteModel, CadastrarPacienteResponseModel } from '../paciente.models';
import { PacienteService } from '../paciente.service';

@Component({
  selector: 'app-cadastrar-paciente',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './cadastrar-paciente.html',
})
export class CadastrarPaciente {
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly router = inject(Router);
  protected readonly pacienteService = inject(PacienteService);
  protected readonly notificacaoService = inject(NotificacaoService);

  protected pacienteForm: FormGroup = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
  });

  get nome() {
    return this.pacienteForm.get('nome');
  }

  get cpf() {
    return this.pacienteForm.get('cpf');
  }

  get email() {
    return this.pacienteForm.get('email');
  }

  get telefone() {
    return this.pacienteForm.get('telefone');
  }

  public cadastrar() {
    if (this.pacienteForm.invalid) return;

    const pacienteModel: CadastrarPacienteModel = this.pacienteForm.value;

    const cadastroObserver: Observer<CadastrarPacienteResponseModel> = {
      next: () =>
        this.notificacaoService.sucesso(
          `O registro "${pacienteModel.nome}" foi cadastrado com sucesso!`
        ),
      error: (err) => this.notificacaoService.erro(err),
      complete: () => this.router.navigate(['/pacientes']),
    };

    this.pacienteService.cadastrar(pacienteModel).subscribe(cadastroObserver);
  }
}
