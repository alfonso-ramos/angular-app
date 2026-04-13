import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  submitAttempted = signal(false);

  maestros = signal<Maestro[]>([]);
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'numeroEmpleado', 'departamento', 'especialidad', 'correo', 'acciones'];
  editingMaestroId = signal<number | null>(null);

  private fb = inject(FormBuilder);
  private maestrosService = inject(MaestrosService);

  private soloTextoValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const soloTextoRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    return soloTextoRegex.test(value) ? null : { soloTexto: true };
  }

  form = this.fb.group({
    nombre: ['', [Validators.required, this.soloTextoValidator.bind(this)]],
    apellido: ['', [Validators.required, this.soloTextoValidator.bind(this)]],
    numeroEmpleado: ['', Validators.required],
    departamento: ['', [Validators.required, this.soloTextoValidator.bind(this)]],
    especialidad: ['', [Validators.required, this.soloTextoValidator.bind(this)]],
    correo: ['', [Validators.required, Validators.email]],
  });

  nombreCtrl = this.form.controls.nombre;
  apellidoCtrl = this.form.controls.apellido;
  numeroEmpleadoCtrl = this.form.controls.numeroEmpleado;
  departamentoCtrl = this.form.controls.departamento;
  especialidadCtrl = this.form.controls.especialidad;
  correoCtrl = this.form.controls.correo;

  nombreErrors = computed(() => {
    const ctrl = this.nombreCtrl;
    const showErrors = this.submitAttempted() || ctrl.touched;
    if (!showErrors || !ctrl.errors) return null;
    if (ctrl.errors['required']) return 'El nombre es obligatorio';
    if (ctrl.errors['soloTexto']) return 'El nombre solo debe contener letras';
    return null;
  });
  apellidoErrors = computed(() => {
    const ctrl = this.apellidoCtrl;
    const showErrors = this.submitAttempted() || ctrl.touched;
    if (!showErrors || !ctrl.errors) return null;
    if (ctrl.errors['required']) return 'El apellido es obligatorio';
    if (ctrl.errors['soloTexto']) return 'El apellido solo debe contener letras';
    return null;
  });
  numeroEmpleadoErrors = computed(() => {
    const ctrl = this.numeroEmpleadoCtrl;
    const showErrors = this.submitAttempted() || ctrl.touched;
    if (!showErrors || !ctrl.errors) return null;
    if (ctrl.errors['required']) return 'El numero de empleado es obligatorio';
    return null;
  });
  departamentoErrors = computed(() => {
    const ctrl = this.departamentoCtrl;
    const showErrors = this.submitAttempted() || ctrl.touched;
    if (!showErrors || !ctrl.errors) return null;
    if (ctrl.errors['required']) return 'El departamento es obligatorio';
    if (ctrl.errors['soloTexto']) return 'El departamento solo debe contener letras';
    return null;
  });
  especialidadErrors = computed(() => {
    const ctrl = this.especialidadCtrl;
    const showErrors = this.submitAttempted() || ctrl.touched;
    if (!showErrors || !ctrl.errors) return null;
    if (ctrl.errors['required']) return 'La especialidad es obligatoria';
    if (ctrl.errors['soloTexto']) return 'La especialidad solo debe contener letras';
    return null;
  });
  correoErrors = computed(() => {
    const ctrl = this.correoCtrl;
    const showErrors = this.submitAttempted() || ctrl.touched;
    if (!showErrors || !ctrl.errors) return null;
    if (ctrl.errors['required']) return 'El correo es obligatorio';
    if (ctrl.errors['email']) return 'El correo no es valido';
    return null;
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
    this.submitAttempted.set(true);
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
    this.submitAttempted.set(false);
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
    this.submitAttempted.set(false);
  }
}
