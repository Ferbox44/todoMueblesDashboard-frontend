import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-menu',
  imports: [MenubarModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: ['/inicio']
      },
      {
        label: 'Estadisticas',
        icon: 'pi pi-chart-bar',
        routerLink: ['/estadisticas']
      },
      {
        label: 'Citas',
        icon: 'pi pi-calendar',
        routerLink: ['/citas']
      },
      {
        label: 'Contenido',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Inicio',
            icon: 'pi pi-bolt'
          },
          {
            label: 'Servicios',
            icon: 'pi pi-server',
            items: [
              {
                label: 'Cocinas',
                icon: 'pi pi-crown'
              },
              {
                label: 'Closets',
                
              },
              {
                label: 'Vestidores',
              },
              {
                label: 'Muebles de Baño',
              },
              {
                label: 'Diseño de Interiores',
              }, {
                label: 'Crear Nuevo',
                icon: 'pi pi-plus'
              },

            ]
          },
          {
            label: 'Nosotros',
            icon: 'pi pi-pencil'
          }
        ]
      }
    ]
  }

}
