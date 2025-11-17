import { Component, inject } from '@angular/core';
import { MedicoService } from '../medico.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-top-10-medicos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AsyncPipe
  ],
  templateUrl: './top-10-medicos.html',
})
export class Top10Medicos {
  private readonly service = inject(MedicoService);
  private readonly fb = inject(FormBuilder);

  carregando = false;

  top10$ = null as any;

  filtroForm = this.fb.group({
    inicio: [''],
    fim: [''],
  });

  buscar() {
    const inicio = this.filtroForm.value.inicio!;
    const fim = this.filtroForm.value.fim!;

    this.carregando = true;

    this.top10$ = this.service.selecionarTop10(inicio, fim).pipe(
      map(res => res ?? []),  // <-- devolve array direto
      tap(() => (this.carregando = false))
    );
  }
}
