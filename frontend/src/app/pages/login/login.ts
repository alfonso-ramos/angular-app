import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  isPasswordVisible = signal(false);
  loginFailed = signal(false);
  isSubmitting = signal(false);
  submitAttempted = signal(false);

  emailCtrl = this.form.controls.email;
  passwordCtrl = this.form.controls.password;

  emailErrors = computed(() => {
    const ctrl = this.emailCtrl;
    const showErrors = this.submitAttempted() || ctrl.touched;
    if (!showErrors || !ctrl.errors) return null;
    if (ctrl.errors['required']) return 'El correo es obligatorio';
    if (ctrl.errors['email']) return 'El correo no es valido';
    return null;
  });

  passwordErrors = computed(() => {
    const ctrl = this.passwordCtrl;
    const showErrors = this.submitAttempted() || ctrl.touched;
    if (!showErrors || !ctrl.errors) return null;
    if (ctrl.errors['required']) return 'La contrasena es obligatoria';
    if (ctrl.errors['minlength']) return 'Minimo 8 caracteres';
    return null;
  });

  togglePasswordVisibility() {
    this.isPasswordVisible.update((v) => !v);
  }

  onSubmit() {
    this.submitAttempted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.loginFailed.set(false);
    const { email, password } = this.form.getRawValue();
    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigateByUrl('/home'),
      error: (error: HttpErrorResponse) => {
        this.loginFailed.set(true);
        this.isSubmitting.set(false);
      },
    });
  }
}
