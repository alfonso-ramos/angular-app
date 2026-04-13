import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidebar-menu',
  imports: [RouterLink, MatListModule, MatIconModule, RouterModule],
  templateUrl: './sidebarmenu.html',
  styleUrl: './sidebarmenu.scss',
})
export class SidebarMenu {
  fragments = [
    { name: 'Home', link: '/home' },
    { name: 'Alumnos', link: '/alumnos' },
    { name: 'Maestros', link: '/profesores' },
    { name: 'Calificaciones', link: '/calificaciones' },
  ];
  activeLink: string | null = null;
}
