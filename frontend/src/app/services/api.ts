import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment';

export interface Alumno {
  id?: number;
  name: string;
  lastname: string;
  enrollment?: string;
  degree: string;
  email?: string;
  semester?: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = enviroment.apiUrl; // http://localhost:3000

  constructor(private http: HttpClient) {}

  // Genera los headers con el token JWT almacenado
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // donde guardes el token
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // --- AUTH ---
  login(email: string, password: string) {
    return this.http.post(`${this.base}/api/auth/login`, { email, password });
  }

  // --- ALUMNOS (todas requieren token) ---
  getAlumnos() {
    return this.http.get<Alumno[]>(`${this.base}/api/alumnos`, {
      headers: this.getHeaders()
    });
  }
  getAlumno(id: number) {
    return this.http.get<Alumno>(`${this.base}/api/alumnos/${id}`, {
      headers: this.getHeaders()
    });
  }
  crearAlumno(data: Alumno) {
    return this.http.post<Alumno>(`${this.base}/api/alumnos`, data, {
      headers: this.getHeaders()
    });
  }
  actualizarAlumno(id: number, data: Partial<Alumno>) {
    return this.http.put<Alumno>(`${this.base}/api/alumnos/${id}`, data, {
      headers: this.getHeaders()
    });
  }
  eliminarAlumno(id: number) {
    return this.http.delete(`${this.base}/api/alumnos/${id}`, {
      headers: this.getHeaders()
    });
  }
}