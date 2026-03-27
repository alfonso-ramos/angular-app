import { Component, inject } from '@angular/core';
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
  hidePassword = true;

  private fb = inject(FormBuilder)
  private auth = inject(AuthService)
  private router = inject(Router)

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  })

  onSubmit(){
    console.log(this.form.value)

    const { email, password } = this.form.getRawValue()
    this.auth.Login(email!,password!)
      .subscribe({
        next: () => this.router.navigateByUrl('/home'),
        error: (error: HttpErrorResponse) => {
          console.log(error)
          console.log(error.status)
        }
      })
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
