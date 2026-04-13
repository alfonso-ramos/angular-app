import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})

export class Login {

  private fb = inject(FormBuilder)
  private auth = inject(AuthService)
  private router = inject(Router)

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  })

  isPasswordVisible = false
  loginFailed = false

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible
  }

  onSubmit(){
    if(this.form.invalid){
      this.form.markAllAsTouched()
      return
    }

    console.log(this.form.value)
    const { email, password } = this.form.getRawValue()
    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigateByUrl('/home'),
      error: (error: HttpErrorResponse) => {
        console.log(error)
        console.log(error.status)
      }
    })
  }
}