import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { LandingPageService } from '../../../services/landing-page.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenubarModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  items: MenuItem[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private landingPageService: LandingPageService
  ) {}

  ngOnInit() {
    this.loadMenuItems();
  }

  private loadMenuItems() {
    this.landingPageService.getLandingPageContent().subscribe({
      next: (content) => {
        const services = content.content.servicesCarousel || [];
        
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
                icon: 'pi pi-bolt',
                routerLink: '/secciones'
              },
              {
                label: 'Servicios',
                icon: 'pi pi-server',
                items: [
                  ...services.map(service => ({
                    label: service.title,
                    icon: 'pi pi-crown',
                    routerLink: ['/' + service.link]
                  })),
                  {
                    label: 'Crear Nuevo',
                    icon: 'pi pi-plus',
                    routerLink: ['/secciones']
                  }
                ]
              },
              {
                label: 'Nosotros',
                icon: 'pi pi-pencil',
                routerLink: ['/nosotros']
              }
            ]
          },
          {
            label: 'Cerrar Sesión',
            icon: 'pi pi-sign-out',
            command: () => this.authService.logout()
          }
        ];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading menu items:', error);
        this.loading = false;
        // Set default menu items in case of error
        this.setDefaultMenuItems();
      }
    });
  }

  private setDefaultMenuItems() {
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
            icon: 'pi pi-bolt',
            routerLink: '/secciones'
          },
          {
            label: 'Servicios',
            icon: 'pi pi-server',
            routerLink: ['/secciones']
          },
          {
            label: 'Nosotros',
            icon: 'pi pi-pencil',
            routerLink: ['/nosotros']
          }
        ]
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => this.authService.logout()
      }
    ];
  }
}
