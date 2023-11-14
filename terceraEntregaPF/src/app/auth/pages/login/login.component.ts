import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService, LoginFormValue } from 'src/app/auth/services/AuthService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hide = true;

  passwordControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(20),
  ]);
  emailControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30),
  ]);

  loginForm = new FormGroup({
    password: this.passwordControl,
    email: this.emailControl,
  });

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute) {
    
    }
    
  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    } else {
      this.authService.login(this.loginForm.value as LoginFormValue)
    }
  }
  ngOnDestroy(): void {
    // this.suscripcionAuthUser?.unsubscribe();
    //this.isLoggedIn.complete();
  }
}
