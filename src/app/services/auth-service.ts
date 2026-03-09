import { computed, Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface SessionUser {
  id: number,
  name: string,
  email: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router)

  mockUser: any[] = [
    {id: 1, name: "José Ramos", email: "correo@gmail.com", password: "123456"},
    {id: 2, name: "Alfonso", email: "correo@hotmail.com", password: "asdfgh"},
  ]

  private readonly storageHey = 'session_user'

  private readonly _currentUser = signal<SessionUser | null>(this.readFromStorage())

  readonly currentUser = computed(() => this._currentUser())
  readonly isAuthenticated = computed(() => this._currentUser() !== null)

  Login(email: string, password: string){
    const exist = this.mockUser.find(user => user.email.toLowerCase() === email.toLowerCase().trim() && user.password.toLowerCase() === password.toLowerCase().trim())

    if(!exist) return false

    const sessionUser: SessionUser = {
      id: exist.id,
      name: exist.name,
      email: exist.email
    }

    localStorage.setItem(this.storageHey, JSON.stringify(sessionUser))

    this._currentUser.set(sessionUser)

    return true
  }

  readFromStorage(){
    const user = localStorage.getItem(this.storageHey)
    if(!user) return null
    try {
      return JSON.parse(user) as SessionUser
    } catch (error) {
      return null
    }
  }

  logout(): void {
    this._currentUser.set(null)
    localStorage.removeItem(this.storageHey)
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
