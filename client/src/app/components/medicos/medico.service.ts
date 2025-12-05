import { map, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { mapearRespostaApi, RespostaApiModel } from '../../util/mapear-resposta-api';
import {
  CadastrarMedicoModel,
  CadastrarMedicoResponseModel,
  DetalhesMedicoModel,
  EditarMedicoModel,
  EditarMedicoResponseModel,
  ListarMedicosApiResponseModel,
  ListarMedicosModel,
  MedicosMaisAtivosResponse,
  MedicoAtivo
} from './medico.models';

@Injectable()
export class MedicoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api/medicos';

  public cadastrar(medicoModel: CadastrarMedicoModel): Observable<CadastrarMedicoResponseModel> {
    return this.http
      .post<RespostaApiModel>(this.apiUrl, medicoModel)
      .pipe(map(mapearRespostaApi<CadastrarMedicoResponseModel>));
  }

  public editar(
    id: string,
    editarMedicoModel: EditarMedicoModel
  ): Observable<EditarMedicoResponseModel> {
    const urlCompleto = `${this.apiUrl}/${id}`;

    return this.http
      .put<RespostaApiModel>(urlCompleto, editarMedicoModel)
      .pipe(map(mapearRespostaApi<EditarMedicoResponseModel>));
  }

  public excluir(id: string): Observable<null> {
    const urlCompleto = `${this.apiUrl}/${id}`;
    return this.http.delete<null>(urlCompleto);
  }

  public selecionarPorId(id: string): Observable<DetalhesMedicoModel> {
    const urlCompleto = `${this.apiUrl}/${id}`;

    return this.http
      .get<RespostaApiModel>(urlCompleto)
      .pipe(map(mapearRespostaApi<DetalhesMedicoModel>));
  }

  public selecionarTodos(): Observable<ListarMedicosModel[]> {
    return this.http.get<RespostaApiModel>(this.apiUrl).pipe(
      map(mapearRespostaApi<ListarMedicosApiResponseModel>),
      map((res) => res.registros)
    );
  }

  public selecionarTop10(
    inicioPeriodo: string,
    terminoPeriodo: string
  ): Observable<MedicoAtivo[]> {
    const url = `${this.apiUrl}/top-10`;

    return this.http
      .get<RespostaApiModel>(url, {
        params: {
          inicioPeriodo,
          terminoPeriodo,
        },
      })
      .pipe(map(mapearRespostaApi<MedicosMaisAtivosResponse>))
      .pipe(map((res) => res.registros));
  }
}
