import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlumnosService, Alumno } from '../../services/alumnos-service';
import { ResumenIaDialogComponent } from './resumen-ia-dialog';

@Component({
  selector: 'app-alumnos',
  imports: [MatListModule, MatIconModule, RouterModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatTableModule, MatDialogModule],
  templateUrl: './alumnos.html',
  styleUrl: './alumnos.scss',
})
export class Alumnos implements OnInit {
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  alumnos = signal<Alumno[]>([]);
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'matricula', 'carrera', 'cuatrimestre', 'correo', 'acciones'];
  editingAlumnoId = signal<number | null>(null);

  private fb = inject(FormBuilder);
  private alumnosService = inject(AlumnosService);
  private dialog = inject(MatDialog);

  form = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    matricula: ['', Validators.required],
    carrera: ['', Validators.required],
    cuatrimestre: [1, [Validators.required, Validators.min(1)]],
    correo: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    this.loadAlumnos();
  }

  loadAlumnos() {
    this.alumnosService.getAlumnos().subscribe({
      next: (data: Alumno[]) => {
        console.log('API Response (alumnos):', data);
        this.alumnos.set(data);
      },
      error: (err) => console.error('Error loading alumnos:', err)
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const formValue = this.form.value;
    const editingId = this.editingAlumnoId();

    if (editingId) {
      // UPDATE ALUMNO
      this.alumnosService.updateAlumno(editingId, {
        nombre: formValue.nombre!,
        apellido: formValue.apellido!,
        matricula: formValue.matricula!,
        carrera: formValue.carrera!,
        cuatrimestre: formValue.cuatrimestre!,
        correo: formValue.correo!,
      }).subscribe({
        next: () => {
          this.successMessage.set('Alumno actualizado exitosamente');
          this.finishSubmit();
        },
        error: (err) => {
          console.error('Error updating alumno', err);
          this.errorMessage.set('Hubo un error al actualizar el alumno. Intenta de nuevo.');
          this.loading.set(false);
        }
      });
    } else {
      // CREATE ALUMNO
      this.alumnosService.createAlumno({
        nombre: formValue.nombre!,
        apellido: formValue.apellido!,
        matricula: formValue.matricula!,
        carrera: formValue.carrera!,
        cuatrimestre: formValue.cuatrimestre!,
        correo: formValue.correo!,
      }).subscribe({
        next: () => {
          this.successMessage.set('Alumno guardado exitosamente');
          this.finishSubmit();
        },
        error: (err) => {
          console.error('Error creating alumno', err);
          this.errorMessage.set('Hubo un error al guardar el alumno. Intenta de nuevo.');
          this.loading.set(false);
        }
      });
    }
  }

  finishSubmit() {
    this.loading.set(false);
    this.form.reset({ cuatrimestre: 1 });
    this.editingAlumnoId.set(null);
    this.loadAlumnos();
  }

  editAlumno(alumno: Alumno) {
    this.editingAlumnoId.set(alumno.id ?? null);
    this.form.patchValue({
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      matricula: alumno.matricula,
      carrera: alumno.carrera,
      cuatrimestre: alumno.cuatrimestre,
      correo: alumno.correo,
    });
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  deleteAlumno(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
      this.alumnosService.deleteAlumno(id).subscribe({
        next: () => {
          this.loadAlumnos();
          this.successMessage.set('Alumno eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error deleting alumno:', err);
          this.errorMessage.set('Hubo un error al eliminar el alumno.');
        }
      });
    }
  }

  onClear() {
    this.form.reset({ cuatrimestre: 1 });
    this.editingAlumnoId.set(null);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  openResumenIA(alumno: Alumno) {
    this.dialog.open(ResumenIaDialogComponent, {
      width: '600px',
      data: {
        nombreAlumno: `${alumno.nombre} ${alumno.apellido}`,
        alumnoId: alumno.id
      }
    });
  }
}
