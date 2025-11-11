import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { UrlKey } from '@models/url';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'byf-login',
  imports: [ReactiveFormsModule, MatInputModule, RouterLink, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  loginForm!: FormGroup;

  ngOnInit() {
    this._buildForm();
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const user = this.loginForm.value;

    try {
      await this._authService.login(user.username, user.password);
      this._router.navigateByUrl(UrlKey.Home);
    } catch {
      this.loginForm.reset();
      this.loginForm.setErrors({ invalidCredentials: true });
    }
  }

  onForgotPassword() {
    //Logic to restart password
  }

  private _buildForm() {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
}
