import { HttpClient } from '@angular/common/http';
import { computed, Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { map, Observable, tap } from 'rxjs';

export interface SessionUser {
  id: number,
  name: string,
  email: string
}

interface LoginResponse {
  message: string,
  token: string,
  user: SessionUser
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private readonly router = inject(Router)
  private http = inject(HttpClient)

  private readonly storageKey = 'session_user'
  private readonly storageKeyToken = "session_token"
  private readonly loginUrl = `${environment.apiUrl}/auth/login`

  private readonly _currentUser = signal<SessionUser | null>(this.readFromStorage())
  readonly currentUser = computed(() => this._currentUser())
  readonly isAuthenticated = computed(() => this._currentUser() !== null)
  router: any;

  Login(email: string, password: string) : Observable<SessionUser>{
    return this.http.post<LoginResponse>(this.loginUrl, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem(this.storageKey, JSON.stringify(response.user))
        localStorage.setItem(this.storageKeyToken, response.token)
        this._currentUser.set(response.user)
      }),
      map((response) => response.user)
    )
  }

  readFromStorage(){
    const user = localStorage.getItem(this.storageKey)
    if(!user) return null
    try {
      return JSON.parse(user) as SessionUser
    } catch (error) {
      return null
    }
  }

  logout(): void {
    this._currentUser.set(null)
    localStorage.removeItem(this.storageKey)
    localStorage.removeItem(this.storageKeyToken)
    this.router.navigateByUrl('/login')
  }

  getInitials(): string {
    const user = this.currentUser();
    if (!user || !user.name) return '';

    const name = user.name.trim();
    const firstInitial = name.charAt(0).toUpperCase();
    const secondInitial = name.includes(' ') ? name.split(' ')[1].charAt(0).toUpperCase() : '';

    return firstInitial + secondInitial;
  }
}
