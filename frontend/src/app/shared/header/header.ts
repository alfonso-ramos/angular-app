import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth-service';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule,MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
    protected readonly auth = inject(AuthService);
    protected readonly router = inject(Router);

    getInitials(name: string | undefined): string {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length === 1) {
            return name.substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    logout(): void {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}
