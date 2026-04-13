import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../enviroment/enviroment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth-service';

export interface Maestro {
    id?: number;
    nombre: string;
    apellido: string;
    numeroEmpleado: string;
    departamento: string;
    especialidad: string;
    correo: string;
}

interface MaestroAPI {
    id?: number;
    name: string;
    lastname: string;
    employee_id: string;
    department: string;
    speciality: string;
    email: string;
}

@Injectable({
    providedIn: 'root',
})
export class MaestrosService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);

    private readonly maestrosUrl = `${enviroment.apiUrl}/api/profesores`; // ← /api/profesores

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            Authorization: `Bearer ${this.auth.getToken()}`
        });
    }

  // API (inglés) → Componente (español)
    private fromAPI(m: MaestroAPI): Maestro {
        return {
            id:             m.id,
            nombre:         m.name,
            apellido:       m.lastname,
            numeroEmpleado: m.employee_id,
            departamento:   m.department,
            especialidad:   m.speciality,
            correo:         m.email,
        };
    }

  // Componente (español) → API (inglés)
    private toAPI(m: Partial<Maestro>): Partial<MaestroAPI> {
        return {
            name:        m.nombre,
            lastname:    m.apellido,
            employee_id: m.numeroEmpleado,
            department:  m.departamento,
            email:       m.correo,
            speciality: m.especialidad
        };
    }

    getMaestros(): Observable<Maestro[]> {
    return this.http
        .get<MaestroAPI[]>(this.maestrosUrl, { headers: this.getHeaders() })
        .pipe(map(lista => lista.map(m => this.fromAPI(m))));
    }

    createMaestro(maestro: Partial<Maestro>): Observable<Maestro> {
    return this.http
        .post<MaestroAPI>(this.maestrosUrl, this.toAPI(maestro), { headers: this.getHeaders() })
        .pipe(map(m => this.fromAPI(m)));
    }

    updateMaestro(id: number, maestro: Partial<Maestro>): Observable<Maestro> {
        return this.http
        .put<MaestroAPI>(`${this.maestrosUrl}/${id}`, this.toAPI(maestro), { headers: this.getHeaders() })
        .pipe(map(m => this.fromAPI(m)));
    }

    deleteMaestro(id: number): Observable<void> {
        return this.http.delete<void>(`${this.maestrosUrl}/${id}`, { headers: this.getHeaders() });
    }
}