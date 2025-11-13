import { map, take } from 'rxjs';

import { ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { CanActivateFn, provideRouter, Router, Routes } from '@angular/router';

import { provideAuth } from './components/auth/auth.provider';
import { AuthService } from './components/auth/auth.service';
import { provideNotifications } from './components/shared/notificacao/notificacao.provider';

const usuarioDesconhecidoGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.accessToken$.pipe(
    take(1),
    map((token) => (!token ? true : router.createUrlTree(['/inicio'])))
  );
};

const usuarioAutenticadoGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.accessToken$.pipe(
    take(1),
    map((token) => (token ? true : router.createUrlTree(['/auth/login'])))
  );
};

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth.routes').then((r) => r.authRoutes),
    canMatch: [usuarioDesconhecidoGuard],
  },
  {
    path: 'inicio',
    loadComponent: () => import('./components/inicio/inicio').then((c) => c.Inicio),
    canMatch: [usuarioAutenticadoGuard],
  },
  {
    path: 'medicos',
    loadChildren: () => import('./components/medicos/medico.routes').then((c) => c.medicoRoutes),
    canMatch: [usuarioAutenticadoGuard],
  },
  {
    path: 'pacientes',
    loadChildren: () => import('./components/pacientes/paciente.routes').then((c) => c.pacienteRoutes),
    canMatch: [usuarioAutenticadoGuard],
  },
  {
    path: 'atividades-medicas',
    loadChildren: () => import('./components/atividade-medicas/atividade-medica.routes').then((c) => c.atividadeMedicaRoutes),
    canMatch: [usuarioAutenticadoGuard],
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),

    provideNotifications(),
    provideAuth(),
  ],
};
