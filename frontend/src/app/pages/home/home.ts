import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly auth = inject(AuthService)
  private readonly router = inject(Router)

  logout() : void {
    this.auth.logout()
    this.router.navigateByUrl('/login')
  }
}
