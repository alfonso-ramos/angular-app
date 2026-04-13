import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { enviroment } from '../../enviroment/enviroment';

interface LoginResponse {
  token: string;
  user: { id: number; name: string; email: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = enviroment.apiUrl;

  // Signal para el usuario actual
  currentUser = signal<{ id?: number; name: string; email: string } | null>(null);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, {
      email, password
    }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.currentUser.set(res.user); // ← guarda el usuario
      })
    );
  }

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.base}/auth/register`, {
      name, email, password
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // --- Métodos de usuarios ---
  getUsers() {
    return this.http.get<any[]>(`${this.base}/api/users`, {
      headers: this.getHeaders()
    });
  }

  updateUser(id: number, data: { name?: string; email?: string; password?: string }) {
    return this.http.put(`${this.base}/api/users/${id}`, data, {
      headers: this.getHeaders()
    });
  } 

  deleteUser(id: number) {
    return this.http.delete(`${this.base}/api/users/${id}`, {
      headers: this.getHeaders()
    });
  }
}