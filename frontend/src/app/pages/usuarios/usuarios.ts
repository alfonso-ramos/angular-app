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
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-usuarios',
  imports: [
    MatListModule, 
    MatIconModule, 
    RouterModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatProgressSpinnerModule, 
    MatTableModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class Usuarios implements OnInit {
  hide = signal(true);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  users = signal<any[]>([]);
  displayedColumns: string[] = ['id', 'name', 'email', 'acciones'];
  editingUserId = signal<number | null>(null);

  private fb = inject(FormBuilder);
  private autService = inject(AuthService);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''], // Password unrequired for editing
  })

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.autService.getUsers().subscribe({
      next: (data: any) => {
        console.log('API Response (users):', data);
        // Sometimes APIs return the array inside a property like `data` or `users`
        // e.g., if (data.data) this.users.set(data.data);
        this.users.set(data);
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { name, email, password } = this.form.value;
    const editingId = this.editingUserId();

    if (editingId) {
      // UPDATE USER
      this.autService.updateUser(editingId, { name: name!, email: email!, password: password || undefined }).subscribe({
        next: () => {
          this.successMessage.set('Usuario actualizado exitosamente');
          this.finishSubmit();
        },
        error: (err) => {
          console.error('Error updating user', err);
          this.errorMessage.set('Hubo un error al actualizar el usuario. Intenta de nuevo.');
          this.loading.set(false);
        }
      });
    } else {
      // CREATE USER
      if (!password || password.length < 6) {
          this.errorMessage.set('La contraseña es obligatoria y debe tener al menos 6 caracteres.');
          this.loading.set(false);
          return;
      }
      this.autService.register(name!, email!, password!).subscribe({
        next: () => {
          this.successMessage.set('Usuario guardado exitosamente');
          this.finishSubmit();
        },
        error: (err) => {
          console.error('Error registering user', err);
          this.errorMessage.set('Hubo un error al guardar el usuario. Intenta de nuevo.');
          this.loading.set(false);
        }
      });
    }
  }

  finishSubmit() {
    this.loading.set(false);
    this.form.reset();
    this.editingUserId.set(null);
    this.hide.set(true);
    this.loadUsers();
  }

  editUser(user: any) {
    this.editingUserId.set(user.id);
    this.form.patchValue({
      name: user.name,
      email: user.email,
      password: ''
    });
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  deleteUser(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.autService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
          this.successMessage.set('Usuario eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.errorMessage.set('Hubo un error al eliminar el usuario.');
        }
      });
    }
  }

  onClear() {
    this.form.reset();
    this.editingUserId.set(null);
    this.hide.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}