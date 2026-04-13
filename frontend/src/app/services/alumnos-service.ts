import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../enviroment/enviroment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth-service';

export interface Alumno {
    id?: number;
    nombre: string;
    apellido: string;
    matricula: string;
    carrera: string;
    cuatrimestre: number;
    correo: string;
}

interface AlumnoAPI {
    id?: number;
    name: string;
    lastname: string;
    enrollment: string;
    degree: string;
    semester: number;
    email: string;
}

@Injectable({
    providedIn: 'root',
})
export class AlumnosService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);

    private readonly alumnosUrl = `${enviroment.apiUrl}/api/alumnos`;

// Token JWT para cada petición
    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            Authorization: `Bearer ${this.auth.getToken()}`
        });
    }

  // API (inglés) → Componente (español)
    private fromAPI(a: AlumnoAPI): Alumno {
        return {
            id:           a.id,
            nombre:       a.name,
            apellido:     a.lastname,
            matricula:    a.enrollment,
            carrera:      a.degree,
            cuatrimestre: a.semester,
            correo:       a.email,
        };
    }

  // Componente (español) → API (inglés)
    private toAPI(a: Partial<Alumno>): Partial<AlumnoAPI> {
        return {
            name:       a.nombre,
            lastname:   a.apellido,
            enrollment: a.matricula,
            degree:     a.carrera,
            semester:   a.cuatrimestre,
            email:      a.correo,
        };
    }

    getAlumnos(): Observable<Alumno[]> {
        return this.http
        .get<AlumnoAPI[]>(this.alumnosUrl, { headers: this.getHeaders() })
        .pipe(map(lista => lista.map(a => this.fromAPI(a))));
    }

    createAlumno(alumno: Partial<Alumno>): Observable<Alumno> {
        return this.http
        .post<AlumnoAPI>(this.alumnosUrl, this.toAPI(alumno), { headers: this.getHeaders() })
        .pipe(map(a => this.fromAPI(a)));
    }

    updateAlumno(id: number, alumno: Partial<Alumno>): Observable<Alumno> {
        return this.http
        .put<AlumnoAPI>(`${this.alumnosUrl}/${id}`, this.toAPI(alumno), { headers: this.getHeaders() })
        .pipe(map(a => this.fromAPI(a)));
    }

    deleteAlumno(id: number): Observable<void> {
        return this.http.delete<void>(`${this.alumnosUrl}/${id}`, { headers: this.getHeaders() });
    }

    getResumenIA(id: number): Observable<any> {
        return this.http.get<any>(
            `${enviroment.apiUrl}/api/ia/resumen/${id}`,
            { headers: this.getHeaders() }
        );
    }
}