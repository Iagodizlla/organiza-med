import {
  BehaviorSubject,
  defer,
  distinctUntilChanged,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  skip,
  tap,
} from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import { environment } from '../../../environments/environment';
import { mapearRespostaApi, RespostaApiModel } from '../../util/mapear-resposta-api';
import { AccessTokenModel, LoginModel, RegistroModel } from './auth.models';

@Injectable()
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/auth';
  private readonly chaveAccessToken: string = 'organiza-med:access-token';

  public readonly accessTokenSubject$ = new BehaviorSubject<AccessTokenModel | undefined>(
    undefined
  );

  public readonly accessTokenArmazenado$ = defer(() => {
    const accessToken = this.obterAccessToken();

    if (!accessToken) return of(undefined);

    const valido = new Date(accessToken.expiracao) > new Date(); // DateTime.Now

    if (!valido) return of(undefined);

    return of(accessToken);
  });

  public readonly accessToken$ = merge(
    this.accessTokenArmazenado$,
    this.accessTokenSubject$.pipe(skip(1))
  ).pipe(
    distinctUntilChanged((a, b) => a === b),
    tap((accessToken) => {
      if (accessToken) this.salvarAccessToken(accessToken);
      else this.limparAccessToken();

      this.accessTokenSubject$.next(accessToken);
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  public registro(registroModel: RegistroModel): Observable<AccessTokenModel> {
    const urlCompleto = `${this.apiUrl}/registrar`;

    return this.http.post<RespostaApiModel>(urlCompleto, registroModel).pipe(
      map(mapearRespostaApi<AccessTokenModel>),
      tap((token) => this.accessTokenSubject$.next(token))
    );
  }

  public login(loginModel: LoginModel): Observable<AccessTokenModel> {
    const urlCompleto = `${this.apiUrl}/autenticar`;

    return this.http.post<RespostaApiModel>(urlCompleto, loginModel).pipe(
      map(mapearRespostaApi<AccessTokenModel>),
      tap((token) => this.accessTokenSubject$.next(token))
    );
  }

  public sair(): Observable<null> {
    const urlCompleto = `${this.apiUrl}/sair`;

    return this.http.post<null>(urlCompleto, {}).pipe(
      tap(() => {
        this.limparAccessToken();
        this.accessTokenSubject$.next(undefined);
      })
    );
  }

  private salvarAccessToken(token: AccessTokenModel): void {
    const jsonString = JSON.stringify(token);
    localStorage.setItem(this.chaveAccessToken, jsonString);
  }

  private limparAccessToken(): void {
    localStorage.removeItem(this.chaveAccessToken);
  }

  private obterAccessToken(): AccessTokenModel | undefined {
    const jsonString = localStorage.getItem(this.chaveAccessToken);
    if (!jsonString) return undefined;
    return JSON.parse(jsonString);
  }
}
