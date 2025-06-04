import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { InicioComponent } from './components/inicio/inicio.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { CitasComponent } from './components/citas/citas.component';
import { SectionsComponent } from './components/sections/sections.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'inicio',
        component: InicioComponent
      },
      {
        path: 'estadisticas',
        component: EstadisticasComponent
      },
      {
        path: 'citas',
        component: CitasComponent
      },
      {
        path: 'secciones',
        component: SectionsComponent
      },
      {
        path: 'upload',
        loadComponent: () => import('./components/file-upload/file-upload.component').then(m => m.FileUploadComponent)
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  }
];
