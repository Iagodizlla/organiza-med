import { map, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { mapearRespostaApi, RespostaApiModel } from '../../util/mapear-resposta-api';
import {
  CadastrarAtividadeMedicaModel,
  CadastrarAtividadeMedicaResponseModel,
  DetalhesAtividadeMedicaModel,
  EditarAtividadeMedicaModel,
  EditarAtividadeMedicaResponseModel,
  ListarAtividadesMedicasApiResponseModel,
  ListarAtividadesMedicasModel,
  TipoAtividadeMedicaEnum,
} from './atividade-medica.models';

@Injectable()
export class AtividadeMedicaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/atividades-medicas';

  public cadastrar(
    medicoModel: CadastrarAtividadeMedicaModel
  ): Observable<CadastrarAtividadeMedicaResponseModel> {
    return this.http
      .post<RespostaApiModel>(this.apiUrl, medicoModel)
      .pipe(map(mapearRespostaApi<CadastrarAtividadeMedicaResponseModel>));
  }

  public editar(
    id: string,
    editarAtividadeMedicaModel: EditarAtividadeMedicaModel
  ): Observable<EditarAtividadeMedicaResponseModel> {
    const urlCompleto = `${this.apiUrl}/${id}`;

    return this.http
      .put<RespostaApiModel>(urlCompleto, editarAtividadeMedicaModel)
      .pipe(map(mapearRespostaApi<EditarAtividadeMedicaResponseModel>));
  }

  public excluir(id: string): Observable<null> {
    const urlCompleto = `${this.apiUrl}/${id}`;

    return this.http.delete<null>(urlCompleto);
  }

  public selecionarPorId(id: string): Observable<DetalhesAtividadeMedicaModel> {
    const urlCompleto = `${this.apiUrl}/${id}`;

    return this.http
      .get<RespostaApiModel>(urlCompleto)
      .pipe(map(mapearRespostaApi<DetalhesAtividadeMedicaModel>));
  }

  public selecionarTodos(): Observable<ListarAtividadesMedicasModel[]> {
    return this.http.get<RespostaApiModel>(this.apiUrl).pipe(
      map(mapearRespostaApi<ListarAtividadesMedicasApiResponseModel>),
      map((res) => res.registros)
    );
  }

  public selecionarPorTipoAtividade(
    tipoAtividade: TipoAtividadeMedicaEnum
  ): Observable<ListarAtividadesMedicasModel[]> {
    const urlCompleto = `${this.apiUrl}?tipoAtividade=${tipoAtividade.toLowerCase()}`;

    return this.http.get<RespostaApiModel>(urlCompleto).pipe(
      map(mapearRespostaApi<ListarAtividadesMedicasApiResponseModel>),
      map((res) => res.registros)
    );
  }
}
