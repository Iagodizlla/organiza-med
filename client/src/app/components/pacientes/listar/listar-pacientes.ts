import { filter, map } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ListarPacientesModel } from '../paciente.models';

@Component({
  selector: 'app-listar-pacientes',
  imports: [MatButtonModule, MatIconModule, MatCardModule, RouterLink, AsyncPipe],
  templateUrl: './listar-pacientes.html',
})
export class ListarPacientes {
  protected readonly route = inject(ActivatedRoute);

  protected readonly pacientes$ = this.route.data.pipe(
    filter((data) => data['pacientes']),
    map((data) => data['pacientes'] as ListarPacientesModel[])
  );
}
