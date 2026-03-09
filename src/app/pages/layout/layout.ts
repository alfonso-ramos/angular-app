import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebarmenu } from '../../shared/sidebarmenu/sidebarmenu';
import { AuthService } from '../../services/auth-service';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { MatButtonModule   } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    Sidebarmenu,
    MatIconModule,
    MatMenuTrigger,
    MatMenuModule,
    MatButtonModule,
],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})

export class Layout {

  authService = inject(AuthService)
  initials = this.authService.getInitials();

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | undefined;
  menu: any;

  matMenuTriggerFor() {
    this.trigger?.openMenu();
  }
}
