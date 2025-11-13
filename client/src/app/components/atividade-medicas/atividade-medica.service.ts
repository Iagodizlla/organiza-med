import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CadastrarAtividadeModel,
  ListarAtividadesApiResponseModel
} from './atividade-medica.models';

@Injectable({ providedIn: 'root' })
export class AtividadeMedicaService {
  private apiUrl = 'https://localhost:7043/api/atividades-medicas';

  constructor(private http: HttpClient) {}

  listar(): Observable<ListarAtividadesApiResponseModel> {
    return this.http.get<ListarAtividadesApiResponseModel>(this.apiUrl);
  }

  cadastrar(model: CadastrarAtividadeModel): Observable<any> {
    return this.http.post(this.apiUrl, model);
  }
}
