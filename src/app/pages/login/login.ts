import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

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
    // if(this.form.invalid){
    //   this.form.markAllAsDirty()
    //   return
    // }

    console.log(this.form.value)

    const { email, password } = this.form.getRawValue()
    const valid = this.auth.Login(email!, password!)

    if(valid){
      this.router.navigateByUrl('/home')
      return;
    }

  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
