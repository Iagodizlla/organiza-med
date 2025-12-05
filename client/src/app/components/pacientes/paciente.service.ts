import { map, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { mapearRespostaApi, RespostaApiModel } from '../../util/mapear-resposta-api';
import {
    CadastrarPacienteModel, CadastrarPacienteResponseModel, DetalhesPacienteModel,
    EditarPacienteModel, EditarPacienteResponseModel, ListarPacientesApiResponseModel,
    ListarPacientesModel
} from './paciente.models';

@Injectable()
export class PacienteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api/pacientes';

  public cadastrar(
    medicoModel: CadastrarPacienteModel
  ): Observable<CadastrarPacienteResponseModel> {
    return this.http
      .post<RespostaApiModel>(this.apiUrl, medicoModel)
      .pipe(map(mapearRespostaApi<CadastrarPacienteResponseModel>));
  }

  public editar(
    id: string,
    editarPacienteModel: EditarPacienteModel
  ): Observable<EditarPacienteResponseModel> {
    const urlCompleto = `${this.apiUrl}/${id}`;

    return this.http
      .put<RespostaApiModel>(urlCompleto, editarPacienteModel)
      .pipe(map(mapearRespostaApi<EditarPacienteResponseModel>));
  }

  public excluir(id: string): Observable<null> {
    const urlCompleto = `${this.apiUrl}/${id}`;

    return this.http.delete<null>(urlCompleto);
  }

  public selecionarPorId(id: string): Observable<DetalhesPacienteModel> {
    const urlCompleto = `${this.apiUrl}/${id}`;

    return this.http
      .get<RespostaApiModel>(urlCompleto)
      .pipe(map(mapearRespostaApi<DetalhesPacienteModel>));
  }

  public selecionarTodos(): Observable<ListarPacientesModel[]> {
    return this.http.get<RespostaApiModel>(this.apiUrl).pipe(
      map(mapearRespostaApi<ListarPacientesApiResponseModel>),
      map((res) => res.registros)
    );
  }
}
