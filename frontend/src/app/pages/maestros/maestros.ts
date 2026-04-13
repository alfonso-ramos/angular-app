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
import { MaestrosService, Maestro } from '../../services/maestros-service';

@Component({
  selector: 'app-maestros',
  imports: [MatListModule, MatIconModule, RouterModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatTableModule],
  templateUrl: './maestros.html',
  styleUrl: '../alumnos/alumnos.scss',
})
export class Maestros implements OnInit {
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  maestros = signal<Maestro[]>([]);
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'numeroEmpleado', 'departamento', 'especialidad', 'correo', 'acciones'];
  editingMaestroId = signal<number | null>(null);

  private fb = inject(FormBuilder);
  private maestrosService = inject(MaestrosService);

  form = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    numeroEmpleado: ['', Validators.required],
    departamento: ['', Validators.required],
    especialidad: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    this.loadMaestros();
  }

  loadMaestros() {
    this.maestrosService.getMaestros().subscribe({
      next: (data: Maestro[]) => {
        console.log('API Response (maestros):', data);
        this.maestros.set(data);
      },
      error: (err) => console.error('Error loading maestros:', err)
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
    const editingId = this.editingMaestroId();

    if (editingId) {
      // UPDATE MAESTRO
      this.maestrosService.updateMaestro(editingId, {
        nombre: formValue.nombre!,
        apellido: formValue.apellido!,
        numeroEmpleado: formValue.numeroEmpleado!,
        departamento: formValue.departamento!,
        especialidad: formValue.especialidad!,
        correo: formValue.correo!,
      }).subscribe({
        next: () => {
          this.successMessage.set('Maestro actualizado exitosamente');
          this.finishSubmit();
        },
        error: (err) => {
          console.error('Error updating maestro', err);
          this.errorMessage.set('Hubo un error al actualizar el maestro. Intenta de nuevo.');
          this.loading.set(false);
        }
      });
    } else {
      // CREATE MAESTRO
      this.maestrosService.createMaestro({
        nombre: formValue.nombre!,
        apellido: formValue.apellido!,
        numeroEmpleado: formValue.numeroEmpleado!,
        departamento: formValue.departamento!,
        especialidad: formValue.especialidad!,
        correo: formValue.correo!,
      }).subscribe({
        next: () => {
          this.successMessage.set('Maestro guardado exitosamente');
          this.finishSubmit();
        },
        error: (err) => {
          console.error('Error creating maestro', err);
          this.errorMessage.set('Hubo un error al guardar el maestro. Intenta de nuevo.');
          this.loading.set(false);
        }
      });
    }
  }

  finishSubmit() {
    this.loading.set(false);
    this.form.reset();
    this.editingMaestroId.set(null);
    this.loadMaestros();
  }

  editMaestro(maestro: Maestro) {
    this.editingMaestroId.set(maestro.id ?? null);
    this.form.patchValue({
      nombre: maestro.nombre,
      apellido: maestro.apellido,
      numeroEmpleado: maestro.numeroEmpleado,
      departamento: maestro.departamento,
      especialidad: maestro.especialidad,
      correo: maestro.correo,
    });
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  deleteMaestro(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este maestro?')) {
      this.maestrosService.deleteMaestro(id).subscribe({
        next: () => {
          this.loadMaestros();
          this.successMessage.set('Maestro eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error deleting maestro:', err);
          this.errorMessage.set('Hubo un error al eliminar el maestro.');
        }
      });
    }
  }

  onClear() {
    this.form.reset();
    this.editingMaestroId.set(null);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}