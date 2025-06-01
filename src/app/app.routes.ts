import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { CitasComponent } from './components/citas/citas.component';
export const routes: Routes = [
  { 
    path: '', 
    component: InicioComponent 
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
  }
];
